# ============================================================================
# FILE 4: app/algorithms/stride_estimation.py
# ============================================================================
import numpy as np
from scipy.signal import butter, filtfilt
from typing import List, Tuple

def compute_valid_stride_times(ic_times, multiplier=1.75):
    """
    Filters stride intervals based on a median threshold rule.

    Args:
        ic_times (list of float): Initial Contact timestamps in milliseconds
        multiplier (float): Max allowed stride duration as a multiple of median

    Returns:
        stride_times (list of float): Valid stride durations (in seconds)
        valid_ic_pairs (list of tuple): (IC_start, IC_end) for valid strides
    """
    if len(ic_times) < 2:
        return [], []

    # Convert to seconds for interval calculation
    ic_times_sec = [t / 1000.0 for t in ic_times]
    ic_intervals = np.diff(ic_times_sec)
    median_stride = np.median(ic_intervals)
    upper_limit = multiplier * median_stride

    stride_times = []
    valid_ic_pairs = []

    for i, delta in enumerate(ic_intervals):
        if delta <= upper_limit:
            stride_times.append(delta)
            valid_ic_pairs.append((ic_times[i], ic_times[i+1]))

    return stride_times, valid_ic_pairs

def count_steps_from_events(ic_times, to_times, max_gap=2.0):
    """
    Enhanced hybrid step counting:
    - Counts IC→TO always
    - Counts TO→TO and IC→IC if time gap is safe
    - Avoids double counting
    """
    # Merge and sort all events
    events = sorted(
        [{'time': t, 'type': 'IC'} for t in ic_times] +
        [{'time': t, 'type': 'TO'} for t in to_times],
        key=lambda x: x['time']
    )

    steps = []
    i = 0
    while i < len(events) - 1:
        curr = events[i]
        nxt = events[i + 1]
        gap = (nxt['time'] - curr['time']) / 1000   # gap in seconds

        if curr['type'] == 'IC' and nxt['type'] == 'TO':
            # Always count IC→TO
            steps.append((curr['time'], nxt['time'], 'IC→TO'))
            i += 1  # Move only one step forward to check next TO pairing
        elif curr['type'] == nxt['type'] and gap <= max_gap:
            # Count same-type events if safe
            steps.append((curr['time'], nxt['time'], f'{curr["type"]}→{nxt["type"]}'))
            i += 1  # Still only move one step
        i += 1  # Move to next event

    return len(steps), steps

def calculate_cadence(steps):
    """
    Calculate average cadence in steps per minute.
    steps: list of (start_time, end_time, type)
    """
    if len(steps) < 2:
        return 0  # Not enough data

    # convert to seconds
    start_time = steps[0][0] / 1000
    end_time = steps[-1][1] / 1000
    duration_min = (end_time - start_time) / 60

    if duration_min <= 0:
        return 0

    cadence = len(steps) / duration_min
    return round(cadence, 2)

def pendulum_model_stride_length(df, ic_times: List[float], leg_length: float = 0.9) -> List[float]:
    """
    Biomechanical pendulum model approach
    """
    stride_lengths = []
    
    for i in range(len(ic_times) - 1):
        stride_time = (ic_times[i+1] - ic_times[i]) / 1000.0  # Convert to seconds
        g = 9.81  # gravity
        
        # Estimate swing angle from stride time
        swing_time_ratio = stride_time / (2 * np.pi * np.sqrt(leg_length / g))
        estimated_angle = min(swing_time_ratio * np.pi/3, np.pi/3)  # Cap at 60 degrees
        
        stride_length = 2 * leg_length * np.sin(estimated_angle / 2)
        stride_lengths.append(stride_length)
    
    return stride_lengths

def zero_velocity_update_method_identical(df, ic_times: List[float]) -> List[float]:
    """
    ZUPT method with Butterworth filtering and crash protection
    """
    stride_lengths = []
    
    # Convert relative time to absolute timestamps
    ic_times_abs = [t + df["rel_time_ms"].iloc[0] for t in ic_times]
    
    for i in range(len(ic_times_abs) - 1):
        t0 = ic_times_abs[i]
        t1 = ic_times_abs[i + 1]
        
        # Extract stride segment
        mask = (df["rel_time_ms"] >= (t0 - df["rel_time_ms"].iloc[0])) & \
               (df["rel_time_ms"] <= (t1 - df["rel_time_ms"].iloc[0]))
        segment = df[mask].copy()
        
        if len(segment) < 3:
            stride_lengths.append(0.0)
            continue
            
        # Time in seconds, relative to stride start
        time_s = (segment["rel_time_ms"].values - segment["rel_time_ms"].values[0]) / 1000.0
        
        # Use forward acceleration
        ax = segment["ax"].values if "ax" in segment.columns else np.zeros(len(segment))
        
        # High-pass filter with crash protection
        ax_filtered = apply_zupt_filter_identical(ax, time_s)
        
        # Integrate with ZUPT correction
        velocity = integrate_with_zupt_identical(ax_filtered, time_s)
        displacement = np.trapezoid(velocity, time_s)
        
        stride_lengths.append(abs(displacement))
    
    return stride_lengths

def apply_zupt_filter_identical(acceleration, time_s, cutoff_freq=0.5):
    """Apply Butterworth filter with crash protection"""
    if len(acceleration) < 4:
        return acceleration
    
    # Calculate sampling frequency
    fs = 1.0 / np.mean(np.diff(time_s)) if len(time_s) > 1 else 10.0
    
    # High-pass filter to remove drift
    nyquist = fs / 2
    if cutoff_freq < nyquist:
        try:
            # Try Butterworth filter regardless of length
            b, a = butter(3, cutoff_freq / nyquist, btype='high')
            filtered = filtfilt(b, a, acceleration)
            return filtered
        except Exception:
            # Fallback to simple detrending if filter crashes
            return acceleration - np.mean(acceleration)
    else:
        # Fallback to simple detrending
        return acceleration - np.mean(acceleration)

def integrate_with_zupt_identical(acceleration, time_s):
    """Integration with ZUPT correction"""
    # Manual integration
    velocity = np.zeros_like(time_s)
    for i in range(1, len(time_s)):
        dt = time_s[i] - time_s[i-1]
        velocity[i] = velocity[i-1] + acceleration[i-1] * dt
    
    # Apply ZUPT: linear drift correction
    if len(velocity) > 1:
        correction = np.linspace(0, velocity[-1], len(velocity))
        velocity_corrected = velocity - correction
    else:
        velocity_corrected = velocity
    
    return velocity_corrected

def step_detection_based_length(df, ic_times: List[float]) -> List[float]:
    """Step detection using acceleration intensity"""
    stride_lengths = []
    
    for i in range(len(ic_times) - 1):
        stride_time = (ic_times[i+1] - ic_times[i]) / 1000.0  # seconds
        
        # Extract stride data
        t0_rel = ic_times[i]
        t1_rel = ic_times[i+1]
        
        mask = (df["rel_time_ms"] >= t0_rel) & (df["rel_time_ms"] <= t1_rel)
        segment = df[mask].copy()
        
        if len(segment) < 3:
            stride_lengths.append(0.0)
            continue
        
        try:
            # Calculate total acceleration magnitude
            if "a_total" in segment.columns:
                a_total = segment["a_total"]
            elif all(col in segment.columns for col in ["ax", "ay", "az"]):
                a_total = np.sqrt(segment["ax"]**2 + segment["ay"]**2 + segment["az"]**2)
            else:
                a_total = np.ones(len(segment)) * 10.0  # Default
            
            peak_acc = np.max(a_total)
        except:
            peak_acc = 10.0
        
        # Empirical relationship
        base_stride = 1.4 * stride_time  # Base relationship: ~1.4 m/s walking speed
        intensity_factor = np.clip(peak_acc / 15.0, 0.8, 1.3)  # Scale based on acceleration
        
        stride_length = base_stride * intensity_factor
        stride_lengths.append(stride_length)
    
    return stride_lengths

def hybrid_stride_estimation(df, ic_times: List[float]) -> List[float]:
    """Hybrid combination of multiple methods"""
    try:
        # Get estimates from different methods
        pendulum_lengths = pendulum_model_stride_length(df, ic_times)
        zupt_lengths = zero_velocity_update_method_identical(df, ic_times)
        step_lengths = step_detection_based_length(df, ic_times)
        
        stride_lengths = []
        
        min_length = min(len(pendulum_lengths), len(zupt_lengths), len(step_lengths))
        
        for i in range(min_length):
            estimates = [pendulum_lengths[i], zupt_lengths[i], step_lengths[i]]
            
            # Remove outliers
            median_est = np.median(estimates)
            std_est = np.std(estimates)
            
            valid_estimates = [est for est in estimates if abs(est - median_est) <= 2 * std_est]
            
            if valid_estimates:
                if len(valid_estimates) == 3:
                    final_estimate = (2 * pendulum_lengths[i] + zupt_lengths[i] + step_lengths[i]) / 4
                else:
                    final_estimate = np.mean(valid_estimates)
            else:
                final_estimate = median_est
            
            stride_lengths.append(final_estimate)
        
        return stride_lengths
        
    except:
        # Fallback to pendulum model
        return pendulum_model_stride_length(df, ic_times)
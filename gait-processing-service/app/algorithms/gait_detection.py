# ============================================================================
# FILE 3: app/algorithms/gait_detection.py
# ============================================================================
import numpy as np
import pandas as pd
from scipy.signal import find_peaks
from typing import Dict, List

def detect_ic_to(df: pd.DataFrame, time_col: str = "rel_time_ms") -> Dict[str, List[float]]:
    """
    Detect initial contacts and toe-offs from pressure sensor data
    
    Args:
        df: Preprocessed sensor DataFrame
        time_col: Time column name
        
    Returns:
        Dictionary with 'ic_times', 'to_times', 'to_labels'
    """
    try:
        if len(df) < 10:  # Need minimum data points
            return {"ic_times": [], "to_times": [], "to_labels": []}
        
        # Ensure derivatives exist
        if "d_rearfoot" not in df.columns:
            df = compute_derivatives(df, time_col)
        
        # --- Detect ICs ---
        ic_peaks, _ = find_peaks(df["d_rearfoot"], height=10, distance=5)
        ic_times = df[time_col].iloc[ic_peaks].tolist()
        
        # --- Detect TOs using multiple signals ---
        to_times = []
        to_labels = []
        
        if "forefoot" in df.columns and "ay" in df.columns and "dd_forefoot" in df.columns:
            forefoot_peaks, _ = find_peaks(df["forefoot"], height=500)
            ay_peaks, _ = find_peaks(df["ay"], height=2)
            dd_neg_peaks, _ = find_peaks(-df["dd_forefoot"], height=0.05)
            
            for fp_idx in forefoot_peaks:
                # Find forefoot unloading
                after = df["forefoot"].iloc[fp_idx:].reset_index(drop=True)
                zero_cross = after[after < 100]
                if len(zero_cross) == 0:
                    continue
                
                zc_idx = fp_idx + zero_cross.index[0]
                mid_idx = (fp_idx + zc_idx) // 2
                
                # Look for TO indicators in this region
                dd_peaks = [i for i in dd_neg_peaks if fp_idx < i < zc_idx]
                ay_peaks_in_range = [i for i in ay_peaks if fp_idx < i < zc_idx]
                
                if dd_peaks and ay_peaks_in_range:
                    to_times.append(df[time_col].iloc[dd_peaks[0]])
                    to_labels.append("dd")
                elif dd_peaks:
                    to_times.append(df[time_col].iloc[dd_peaks[0]])
                    to_labels.append("dd")
                elif ay_peaks_in_range:
                    to_times.append(df[time_col].iloc[ay_peaks_in_range[0]])
                    to_labels.append("ay")
                elif mid_idx < len(df) and df["dd_forefoot"].iloc[mid_idx] < 0:
                    to_times.append(df[time_col].iloc[mid_idx])
                    to_labels.append("mid")
        
        return {
            "ic_times": ic_times,
            "to_times": to_times,
            "to_labels": to_labels
        }
        
    except Exception as e:
        print(f"❌ Error in gait detection: {e}")
        return {"ic_times": [], "to_times": [], "to_labels": []}

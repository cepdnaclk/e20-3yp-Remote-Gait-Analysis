# ============================================================================
# FILE: app/processor/production_analyzer.py
# ============================================================================
import numpy as np
import logging
from typing import Dict, List, Tuple, Optional, Any

# Import your algorithms
from app.algorithms.stride_estimation import (
    pendulum_model_stride_length,
    zero_velocity_update_method_identical,
    step_detection_based_length,
    hybrid_stride_estimation,
    compute_valid_stride_times,
    count_steps_from_events,
    calculate_cadence
)

class ProductionGaitAnalyzer:
    """
    Production-ready gait analyzer that automatically selects the best method
    """
    
    def __init__(self, calibration_factors: Optional[Dict[str, float]] = None, verbose: bool = True):
        """
        Initialize the production gait analyzer
        
        Args:
            calibration_factors: Dictionary of method_name -> calibration_factor
            verbose: Whether to print detailed output
        """
        # Default calibration factors from your testing
        self.calibration_factors = calibration_factors or {
            'ZUPT Method': 1.201,        # From your 17% error session
            'Step Detection': 0.851,     # From current session  
            'Pendulum Model': 2.561,     # Consistent across sessions
            'Hybrid': 1.495             # Average performance
        }
        
        self.verbose = verbose
        
        # Method priority (higher number = higher priority when errors are similar)
        self.method_priority = {
            'ZUPT Method': 4,      # Highest priority (most accurate when it works)
            'Step Detection': 3,   # Good empirical method
            'Hybrid': 2,           # Combines methods but can be inconsistent
            'Pendulum Model': 1    # Stable but often underestimates
        }
    
    def analyze_gait_session(self, df, ic_times, known_distance: Optional[float] = None) -> Dict[str, Any]:
        """
        Main production function - analyzes gait and returns best result
        
        Args:
            df: Preprocessed sensor DataFrame
            ic_times: List of initial contact times
            known_distance: Optional known distance for validation
            
        Returns:
            Dictionary with analysis results and metadata
        """
        try:
            if self.verbose:
                print("🚀 Production Gait Analysis Starting...")
                print(f"📊 Input: {len(df)} data points, {len(ic_times)} initial contacts")
            
            # Validate inputs
            if len(ic_times) < 2:
                return self._create_error_result("Insufficient gait events (need ≥2 initial contacts)")
            
            # Run all methods with error handling
            method_results = self._run_all_methods(df, ic_times)
            
            if not method_results:
                return self._create_error_result("All gait analysis methods failed")
            
            # Select best method
            best_method, best_result = self._select_best_method(method_results, known_distance)
            
            # Apply calibration
            calibrated_result = self._apply_calibration(best_method, best_result)
            
            # Create comprehensive result
            result = self._create_production_result(
                df, ic_times, method_results, best_method, calibrated_result, known_distance
            )
            
            if self.verbose:
                print(f"🎯 Selected: {best_method}")
                print(f"📏 Distance: {result['distance_meters']:.2f}m")
                print(f"👣 Avg Stride: {result['avg_stride_length_meters']:.2f}m")
            
            return result
            
        except Exception as e:
            return self._create_error_result(f"Critical analysis failure: {str(e)}")
    
    def _run_all_methods(self, df, ic_times) -> Dict[str, Dict[str, Any]]:
        """Run all gait analysis methods with error handling"""
        methods = {
            'Pendulum Model': self._safe_pendulum_analysis,
            'ZUPT Method': self._safe_zupt_analysis,
            'Step Detection': self._safe_step_detection_analysis,
            'Hybrid': self._safe_hybrid_analysis
        }
        
        results = {}
        
        for method_name, method_func in methods.items():
            try:
                result = method_func(df, ic_times)
                if result['success']:
                    results[method_name] = result
                    if self.verbose:
                        print(f"✅ {method_name}: {result['total_distance']:.2f}m")
                        
            except Exception as e:
                if self.verbose:
                    print(f"❌ {method_name}: {e}")
        
        return results
    
    def _safe_pendulum_analysis(self, df, ic_times) -> Dict[str, Any]:
        """Safe pendulum model analysis"""
        try:
            stride_lengths = pendulum_model_stride_length(df, ic_times)
            return {
                'success': True,
                'stride_lengths': stride_lengths,
                'total_distance': np.sum(stride_lengths),
                'avg_stride': np.mean(stride_lengths) if stride_lengths else 0,
                'method_info': 'Biomechanical pendulum model'
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _safe_zupt_analysis(self, df, ic_times) -> Dict[str, Any]:
        """Safe ZUPT analysis"""
        try:
            stride_lengths = zero_velocity_update_method_identical(df, ic_times)
            return {
                'success': True,
                'stride_lengths': stride_lengths,
                'total_distance': np.sum(stride_lengths),
                'avg_stride': np.mean(stride_lengths) if stride_lengths else 0,
                'method_info': 'Zero velocity update with IMU integration'
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _safe_step_detection_analysis(self, df, ic_times) -> Dict[str, Any]:
        """Safe step detection analysis"""
        try:
            stride_lengths = step_detection_based_length(df, ic_times)
            return {
                'success': True,
                'stride_lengths': stride_lengths,
                'total_distance': np.sum(stride_lengths),
                'avg_stride': np.mean(stride_lengths) if stride_lengths else 0,
                'method_info': 'Empirical step detection with acceleration intensity'
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _safe_hybrid_analysis(self, df, ic_times) -> Dict[str, Any]:
        """Safe hybrid analysis"""
        try:
            stride_lengths = hybrid_stride_estimation(df, ic_times)
            return {
                'success': True,
                'stride_lengths': stride_lengths,
                'total_distance': np.sum(stride_lengths),
                'avg_stride': np.mean(stride_lengths) if stride_lengths else 0,
                'method_info': 'Hybrid combination of multiple methods'
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _select_best_method(self, method_results: Dict, known_distance: Optional[float] = None) -> Tuple[str, Dict]:
        """Select the best method based on various criteria"""
        
        if not method_results:
            raise ValueError("No valid method results to select from")
        
        if known_distance:
            # If we have ground truth, select based on accuracy
            return self._select_by_accuracy(method_results, known_distance)
        else:
            # Select based on heuristics and method reliability
            return self._select_by_heuristics(method_results)
    
    def _select_by_accuracy(self, method_results: Dict, known_distance: float) -> Tuple[str, Dict]:
        """Select method with lowest error when ground truth is available"""
        best_method = None
        best_error = float('inf')
        best_result = None
        
        for method_name, result in method_results.items():
            error = abs(result['total_distance'] - known_distance) / known_distance
            
            # Consider both error and method priority for tie-breaking
            adjusted_error = error - (self.method_priority.get(method_name, 0) * 0.01)
            
            if adjusted_error < best_error:
                best_error = adjusted_error
                best_method = method_name
                best_result = result
        
        return best_method, best_result
    
    def _select_by_heuristics(self, method_results: Dict) -> Tuple[str, Dict]:
        """Select method using heuristics when no ground truth available"""
        
        # Calculate statistics across all methods
        distances = [result['total_distance'] for result in method_results.values()]
        median_distance = np.median(distances)
        
        # Score each method
        method_scores = {}
        
        for method_name, result in method_results.items():
            distance = result['total_distance']
            
            # Factors for scoring:
            # 1. Proximity to median (methods agreeing are more reliable)
            proximity_score = 1.0 / (1.0 + abs(distance - median_distance) / median_distance) if median_distance > 0 else 0.5
            
            # 2. Method priority (based on theoretical reliability)
            priority_score = self.method_priority.get(method_name, 1) / 4.0
            
            # 3. Reasonable distance range (0.5m to 5m per stride is reasonable)
            avg_stride = result['avg_stride']
            if 0.5 <= avg_stride <= 5.0:
                range_score = 1.0
            else:
                range_score = 0.5
            
            # 4. Consistency (lower stride length variance is better)
            if len(result['stride_lengths']) > 1:
                stride_cv = np.std(result['stride_lengths']) / np.mean(result['stride_lengths'])
                consistency_score = 1.0 / (1.0 + stride_cv)
            else:
                consistency_score = 0.5
            
            # Combined score (weighted average)
            total_score = (
                0.4 * proximity_score +
                0.3 * priority_score +
                0.2 * range_score +
                0.1 * consistency_score
            )
            
            method_scores[method_name] = total_score
        
        # Select method with highest score
        best_method = max(method_scores, key=method_scores.get)
        best_result = method_results[best_method]
        
        return best_method, best_result
    
    def _apply_calibration(self, method_name: str, result: Dict) -> Dict:
        """Apply calibration factor to the selected method"""
        calibration_factor = self.calibration_factors.get(method_name, 1.0)
        
        calibrated_result = result.copy()
        calibrated_result['raw_distance'] = result['total_distance']
        calibrated_result['calibrated_distance'] = result['total_distance'] * calibration_factor
        calibrated_result['calibration_factor'] = calibration_factor
        calibrated_result['calibrated_stride_lengths'] = [s * calibration_factor for s in result['stride_lengths']]
        
        return calibrated_result
    
    def _create_production_result(self, df, ic_times, method_results, best_method, calibrated_result, known_distance):
        """Create comprehensive production result"""
        
        # Calculate confidence level
        confidence = self._calculate_confidence(method_results, best_method, known_distance)
        
        # Calculate additional metrics
        session_duration = (df["rel_time_ms"].iloc[-1] - df["rel_time_ms"].iloc[0]) / 1000.0 if len(df) > 0 else 0
        
        result = {
            # Primary Results
            'distance_meters': calibrated_result['calibrated_distance'],
            'raw_distance_meters': calibrated_result['raw_distance'],
            'stride_lengths': calibrated_result['calibrated_stride_lengths'],
            'avg_stride_length_meters': np.mean(calibrated_result['calibrated_stride_lengths']) if calibrated_result['calibrated_stride_lengths'] else 0,
            'raw_avg_stride_length_meters': np.mean(calibrated_result['stride_lengths']) if calibrated_result['stride_lengths'] else 0,
            
            # Method Information
            'method_used': best_method,
            'calibration_factor': calibrated_result['calibration_factor'],
            'confidence_level': confidence,
            
            # Session Metrics
            'num_strides': len(calibrated_result['stride_lengths']),
            'num_initial_contacts': len(ic_times),
            'session_duration_seconds': session_duration,
            'avg_stride_time': session_duration / len(calibrated_result['stride_lengths']) if calibrated_result['stride_lengths'] else 0,
            'estimated_cadence': (len(calibrated_result['stride_lengths']) / session_duration * 60) if session_duration > 0 else 0,
            
            # Quality Metrics
            'data_points': len(df),
            'sampling_rate_hz': len(df) / session_duration if session_duration > 0 else 0,
            
            # All Method Results (for debugging/analysis)
            'all_method_results': {name: res['total_distance'] for name, res in method_results.items()},
            
            # Success Status
            'success': True,
            'error_message': None,
            
            # Validation (if known distance provided)
            'validation': self._create_validation_info(calibrated_result['calibrated_distance'], known_distance) if known_distance else None
        }
        
        return result
    
    def _calculate_confidence(self, method_results, best_method, known_distance):
        """Calculate confidence level in the result"""
        if known_distance:
            error = abs(method_results[best_method]['total_distance'] - known_distance) / known_distance
            if error < 0.15:
                return 'high'
            elif error < 0.25:
                return 'medium'
            else:
                return 'low'
        else:
            # Confidence based on method agreement
            distances = [result['total_distance'] for result in method_results.values()]
            if len(distances) >= 3:
                cv = np.std(distances) / np.mean(distances) if np.mean(distances) > 0 else 1.0
                if cv < 0.2:
                    return 'high'
                elif cv < 0.4:
                    return 'medium'
                else:
                    return 'low'
            else:
                return 'medium'
    
    def _create_validation_info(self, estimated_distance, known_distance):
        """Create validation information when ground truth is available"""
        error = estimated_distance - known_distance
        error_percent = abs(error) / known_distance * 100
        
        return {
            'known_distance': known_distance,
            'estimated_distance': estimated_distance,
            'absolute_error': abs(error),
            'error_percent': error_percent,
            'within_20_percent': error_percent <= 20,
            'within_15_percent': error_percent <= 15
        }
    
    def _create_error_result(self, error_message: str) -> Dict[str, Any]:
        """Create error result when analysis fails"""
        return {
            'distance_meters': 0.0,
            'raw_distance_meters': 0.0,
            'stride_lengths': [],
            'avg_stride_length_meters': 0.0,
            'raw_avg_stride_length_meters': 0.0,
            'method_used': None,
            'calibration_factor': 1.0,
            'confidence_level': 'none',
            'num_strides': 0,
            'success': False,
            'error_message': error_message,
            'all_method_results': {}
        }
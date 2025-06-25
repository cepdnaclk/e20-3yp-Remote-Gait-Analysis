# ============================================================================
# FILE 2: app/algorithms/preprocessing.py  
# ============================================================================
import pandas as pd
import numpy as np
from decimal import Decimal
from typing import List, Dict, Any

def preprocess_sensor_dataframe(data: List[Dict[str, Any]]) -> pd.DataFrame:
    """
    Converts raw JSON data from DynamoDB to a preprocessed DataFrame suitable for gait event detection.
    
    Args:
        data: List of sensor data dictionaries from DynamoDB
        
    Returns:
        Preprocessed pandas DataFrame
    """
    if not data:
        return pd.DataFrame()
    
    try:
        # Convert to DataFrame and flatten JSON
        df = pd.json_normalize(data)
        
        # Convert Decimal to float
        df = df.map(lambda x: float(x) if isinstance(x, Decimal) else x)
        
        # Sort by timestamp
        df = df.sort_values(by="timestamp").reset_index(drop=True)
        
        # Ensure all FSR columns exist and clip values
        for i in range(1, 17):
            col = f"FSR_{i}"
            if col not in df.columns:
                df[col] = 0.0  # Fill missing columns with zeros
            df[col] = df[col].clip(0, 4095)
        
        # Replace FSR_14 with FSR_11 (due to hardware wiring)
        if "FSR_11" in df.columns:
            df["FSR_14"] = df["FSR_11"]
        
        # Create relative time in milliseconds
        df["rel_time_ms"] = (df["timestamp"] - df["timestamp"].min())
        
        # Compute region averages
        df = compute_region_averages(df)
        
        # Compute derivatives for gait detection
        df = compute_derivatives(df)
        
        # Add total acceleration if IMU data exists
        if all(col in df.columns for col in ["ax", "ay", "az"]):
            df["a_total"] = np.sqrt(df["ax"]**2 + df["ay"]**2 + df["az"]**2)
        
        return df
        
    except Exception as e:
        print(f"❌ Error in preprocessing: {e}")
        return pd.DataFrame()

def compute_region_averages(df: pd.DataFrame) -> pd.DataFrame:
    """Compute forefoot, midfoot, rearfoot pressure averages"""
    REGION_MAP = {
        "forefoot": [5, 6, 7, 8, 9, 12, 15, 16],
        "midfoot": [1, 2, 10, 11, 13, 14],
        "rearfoot": [3, 4]
    }
    
    for region, indices in REGION_MAP.items():
        sensor_cols = [f"FSR_{i}" for i in indices if f"FSR_{i}" in df.columns]
        if sensor_cols:
            df[region] = df[sensor_cols].mean(axis=1)
        else:
            df[region] = 0.0
    
    return df

def compute_derivatives(df: pd.DataFrame, time_col: str = "rel_time_ms") -> pd.DataFrame:
    """Compute pressure derivatives for gait detection"""
    try:
        if "rearfoot" in df.columns and time_col in df.columns:
            df["d_rearfoot"] = df["rearfoot"].diff() / df[time_col].diff()
        
        if "forefoot" in df.columns and time_col in df.columns:
            df["d_forefoot"] = df["forefoot"].diff() / df[time_col].diff()
            df["dd_forefoot"] = df["d_forefoot"].diff() / df[time_col].diff()
        
        # Fill NaN values with 0
        df = df.fillna(0)
        
    except Exception as e:
        print(f"⚠️ Error computing derivatives: {e}")
    
    return df
# ============================================================================
# FILE: app/visualization/gait_plots.py (NEW FILE)
# ============================================================================

import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import numpy as np
import seaborn as sns
from io import BytesIO
import base64
from typing import List, Dict, Tuple, Optional
import os
from datetime import datetime

# Set matplotlib to non-interactive backend for server environments
plt.switch_backend('Agg')

class GaitVisualizationEngine:
    """
    Production-ready gait visualization engine
    Generates plots and saves them for inclusion in results
    """
    
    def __init__(self, output_dir: str = "temp_plots", save_format: str = "png"):
        self.output_dir = output_dir
        self.save_format = save_format
        self.setup_plotting_style()
        
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
    
    def setup_plotting_style(self):
        """Setup consistent plotting style"""
        plt.style.use('default')
        sns.set_palette("husl")
        
        # Set default figure parameters
        plt.rcParams.update({
            'figure.figsize': (12, 8),
            'font.size': 10,
            'axes.titlesize': 12,
            'axes.labelsize': 10,
            'xtick.labelsize': 9,
            'ytick.labelsize': 9,
            'legend.fontsize': 9,
            'figure.titlesize': 14
        })
    
    def generate_all_plots(self, session_id: str, df_processed, gait_events: Dict, 
                          analysis_result: Dict, valid_stride_times: List = None) -> Dict[str, str]:
        """
        Generate all gait analysis plots for a session
        
        Returns:
            Dictionary mapping plot names to file paths
        """
        plot_files = {}
        
        try:
            ic_times = gait_events["ic_times"]
            to_times = gait_events["to_times"] 
            to_labels = gait_events["to_labels"]
            
            # 1. Gait Events Detection Plot (your existing code)
            plot_files["gait_events"] = self.plot_ic_to_enhanced(
                df_processed, ic_times, to_times, to_labels, session_id
            )
            
            # 2. Stride Time Variation Plot (your existing code)
            if valid_stride_times:
                plot_files["stride_times"] = self.plot_stride_times_enhanced(
                    valid_stride_times, session_id
                )
            
            # 3. Method Comparison Plot (NEW)
            if 'all_method_results' in analysis_result:
                plot_files["method_comparison"] = self.plot_method_comparison(
                    analysis_result['all_method_results'], 
                    analysis_result['method_used'], session_id
                )
            
            # 4. Pressure Heatmap (NEW)
            plot_files["pressure_heatmap"] = self.plot_pressure_heatmap(
                df_processed, session_id
            )
            
            # 5. Stride Length Distribution (NEW)
            if 'stride_lengths' in analysis_result:
                plot_files["stride_distribution"] = self.plot_stride_distribution(
                    analysis_result['stride_lengths'], session_id
                )
            
            # 6. Force Distribution Plot (NEW)
            plot_files["force_distribution"] = self.plot_force_distribution(
                df_processed, session_id
            )
            
            # 7. Session Summary Dashboard (NEW)
            plot_files["session_summary"] = self.plot_session_summary(
                analysis_result, df_processed, session_id
            )
            
            print(f"📊 Generated {len(plot_files)} plots for session {session_id}")
            return plot_files
            
        except Exception as e:
            print(f"❌ Error generating plots: {e}")
            return {}
    
    def plot_ic_to_enhanced(self, df, ic_times, to_times, to_labels, session_id, time_col="rel_time_ms"):
        """Enhanced version of your IC/TO detection plot"""
        # Colors for TO markers
        colors = {"dd": "red", "ay": "blue", "mid": "orange"}
        
        fig, axs = plt.subplots(4, 1, figsize=(14, 16))
        fig.suptitle(f"Gait Events Detection - Session {session_id}", fontsize=16, fontweight='bold')
        
        # 1. Region Pressure
        for region in ["forefoot", "midfoot", "rearfoot"]:
            if region in df.columns:
                axs[0].plot(df[time_col], df[region], label=region.capitalize(), linewidth=2)
        
        for t in ic_times:
            axs[0].axvline(x=t, color='green', linestyle='--', alpha=0.7, linewidth=2)
        for t, lbl in zip(to_times, to_labels):
            axs[0].axvline(x=t, color=colors.get(lbl, 'gray'), linestyle='--', alpha=0.8, linewidth=2)
        
        axs[0].set_title("Region-wise Pressure with Gait Events", fontweight='bold')
        axs[0].set_ylabel("Pressure (ADC units)")
        axs[0].legend()
        axs[0].grid(True, alpha=0.3)
        
        # 2. Pressure derivatives
        if "d_rearfoot" in df.columns and "d_forefoot" in df.columns:
            axs[1].plot(df[time_col], df["d_rearfoot"], label="d(Rearfoot)", color="green", linewidth=2)
            axs[1].plot(df[time_col], df["d_forefoot"], label="d(Forefoot)", color="blue", linewidth=2)
            
            for t in ic_times:
                axs[1].axvline(x=t, color='green', linestyle='--', alpha=0.6)
            for t, lbl in zip(to_times, to_labels):
                axs[1].axvline(x=t, color=colors.get(lbl, 'gray'), linestyle='--', alpha=0.6)
            
            axs[1].set_title("First Derivative of Pressure", fontweight='bold')
            axs[1].set_ylabel("Pressure Rate (ADC/ms)")
            axs[1].legend()
            axs[1].grid(True, alpha=0.3)
        
        # 3. Second derivative
        if "dd_forefoot" in df.columns:
            axs[2].plot(df[time_col], df["dd_forefoot"], label="dd(Forefoot)", color="red", linewidth=2)
            
            for t in ic_times:
                axs[2].axvline(x=t, color='green', linestyle='--', alpha=0.6)
            for t, lbl in zip(to_times, to_labels):
                axs[2].axvline(x=t, color=colors.get(lbl, 'gray'), linestyle='--', alpha=0.6)
            
            axs[2].set_title("Second Derivative of Forefoot Pressure", fontweight='bold')
            axs[2].set_ylabel("Acceleration (ADC/ms²)")
            axs[2].legend()
            axs[2].grid(True, alpha=0.3)
        
        # 4. Vertical acceleration
        if "ay" in df.columns:
            axs[3].plot(df[time_col], df["ay"], label="Vertical Acceleration", color="purple", linewidth=2)
            
            for t in ic_times:
                axs[3].axvline(x=t, color='green', linestyle='--', alpha=0.6)
            for t, lbl in zip(to_times, to_labels):
                axs[3].axvline(x=t, color=colors.get(lbl, 'gray'), linestyle='--', alpha=0.6)
            
            axs[3].set_title("Vertical Acceleration", fontweight='bold')
            axs[3].set_ylabel("Acceleration (m/s²)")
            axs[3].legend()
            axs[3].grid(True, alpha=0.3)
        
        # Format x-axis for all subplots
        for ax in axs:
            ax.set_xlabel("Time (ms)")
            ax.xaxis.set_major_formatter(ticker.FuncFormatter(lambda x, _: f"{int(x)}"))
        
        # Add custom legend
        legend_elements = [
            plt.Line2D([0], [0], color='green', linestyle='--', linewidth=2, label='Initial Contact'),
            plt.Line2D([0], [0], color='red', linestyle='--', linewidth=2, label='TO (dd_forefoot)'),
            plt.Line2D([0], [0], color='blue', linestyle='--', linewidth=2, label='TO (ay peak)'),
            plt.Line2D([0], [0], color='orange', linestyle='--', linewidth=2, label='TO (fallback)')
        ]
        
        fig.legend(handles=legend_elements, loc='lower center', bbox_to_anchor=(0.5, -0.02), ncol=4)
        plt.tight_layout()
        plt.subplots_adjust(bottom=0.05)
        
        filename = f"{self.output_dir}/gait_events_{session_id}.{self.save_format}"
        plt.savefig(filename, dpi=150, bbox_inches='tight')
        plt.close()
        
        return filename
    
    def plot_stride_times_enhanced(self, valid_stride_times, session_id, 
                                 title="Stride Time Variation"):
        """Enhanced version of your stride times plot"""
        if not valid_stride_times:
            return None
        
        # Convert to seconds
        stride_times_sec = [t for t in valid_stride_times]
        stride_numbers = list(range(1, len(stride_times_sec) + 1))
        
        avg_stride = np.mean(stride_times_sec)
        std_stride = np.std(stride_times_sec)
        
        plt.figure(figsize=(12, 6))
        
        # Main stride time plot
        plt.plot(stride_numbers, stride_times_sec, marker='o', linestyle='-', 
                color='teal', linewidth=2, markersize=6, label='Stride Time')
        
        # Average line
        plt.axhline(avg_stride, color='red', linestyle='--', linewidth=2,
                   label=f'Average: {avg_stride:.2f}s')
        
        # Standard deviation bands
        plt.fill_between(stride_numbers, 
                        [avg_stride - std_stride] * len(stride_numbers),
                        [avg_stride + std_stride] * len(stride_numbers),
                        alpha=0.2, color='red', label=f'±1 SD: {std_stride:.2f}s')
        
        plt.title(f"{title} - Session {session_id}", fontweight='bold', fontsize=14)
        plt.xlabel("Stride Number")
        plt.ylabel("Stride Time (s)")
        plt.legend()
        plt.grid(True, alpha=0.3)
        
        # Add statistics text box
        stats_text = f"Count: {len(stride_times_sec)}\nMean: {avg_stride:.2f}s\nStd: {std_stride:.2f}s\nCV: {(std_stride/avg_stride)*100:.1f}%"
        plt.text(0.02, 0.98, stats_text, transform=plt.gca().transAxes, 
                verticalalignment='top', bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))
        
        plt.tight_layout()
        
        filename = f"{self.output_dir}/stride_times_{session_id}.{self.save_format}"
        plt.savefig(filename, dpi=150, bbox_inches='tight')
        plt.close()
        
        return filename
    
    def plot_method_comparison(self, all_method_results: Dict, best_method: str, session_id):
        """NEW: Compare different stride length estimation methods"""
        methods = list(all_method_results.keys())
        distances = list(all_method_results.values())
        
        plt.figure(figsize=(10, 6))
        
        # Create bar plot
        colors = ['lightcoral', 'skyblue', 'lightgreen', 'gold']
        bars = plt.bar(methods, distances, color=colors, edgecolor='black', linewidth=1)
        
        # Highlight best method
        for i, method in enumerate(methods):
            if method == best_method:
                bars[i].set_color('darkgreen')
                bars[i].set_edgecolor('black')
                bars[i].set_linewidth(2)
        
        # Add value labels on bars
        for bar, distance in zip(bars, distances):
            height = bar.get_height()
            plt.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                    f'{distance:.1f}m', ha='center', va='bottom', fontweight='bold')
        
        plt.title(f"Distance Estimation Method Comparison - Session {session_id}", 
                 fontweight='bold', fontsize=14)
        plt.xlabel("Method")
        plt.ylabel("Estimated Distance (m)")
        plt.xticks(rotation=45, ha='right')
        plt.grid(True, alpha=0.3, axis='y')
        
        # Add best method annotation
        plt.text(0.02, 0.98, f"Selected: {best_method}", transform=plt.gca().transAxes,
                verticalalignment='top', bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.8),
                fontweight='bold')
        
        plt.tight_layout()
        
        filename = f"{self.output_dir}/method_comparison_{session_id}.{self.save_format}"
        plt.savefig(filename, dpi=150, bbox_inches='tight')
        plt.close()
        
        return filename
    
    def plot_pressure_heatmap(self, df_processed, session_id):
        """NEW: Pressure sensor heatmap over time"""
        # Get FSR sensor columns
        fsr_cols = [col for col in df_processed.columns if col.startswith('FSR_')]
        
        if not fsr_cols:
            return None
        
        # Create heatmap data
        time_points = df_processed['rel_time_ms'].values
        pressure_data = df_processed[fsr_cols].values.T  # Transpose for sensors x time
        
        plt.figure(figsize=(14, 8))
        
        # Create heatmap
        im = plt.imshow(pressure_data, aspect='auto', cmap='hot', interpolation='bilinear')
        
        # Set labels
        plt.colorbar(im, label='Pressure (ADC units)')
        plt.title(f"Pressure Sensor Heatmap Over Time - Session {session_id}", 
                 fontweight='bold', fontsize=14)
        plt.xlabel("Time Points")
        plt.ylabel("Sensor Number")
        
        # Set y-axis labels to sensor numbers
        sensor_numbers = [col.replace('FSR_', '') for col in fsr_cols]
        plt.yticks(range(len(sensor_numbers)), sensor_numbers)
        
        # Set x-axis to show time in seconds
        time_ticks = np.linspace(0, len(time_points)-1, 6, dtype=int)
        time_labels = [f"{time_points[i]/1000:.1f}s" for i in time_ticks]
        plt.xticks(time_ticks, time_labels)
        
        plt.tight_layout()
        
        filename = f"{self.output_dir}/pressure_heatmap_{session_id}.{self.save_format}"
        plt.savefig(filename, dpi=150, bbox_inches='tight')
        plt.close()
        
        return filename
    
    def plot_stride_distribution(self, stride_lengths: List[float], session_id):
        """NEW: Stride length distribution analysis"""
        if not stride_lengths:
            return None
        
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
        
        # Histogram
        ax1.hist(stride_lengths, bins=min(10, len(stride_lengths)//2), 
                color='skyblue', edgecolor='black', alpha=0.7)
        ax1.axvline(np.mean(stride_lengths), color='red', linestyle='--', linewidth=2,
                   label=f'Mean: {np.mean(stride_lengths):.2f}m')
        ax1.set_title("Stride Length Distribution", fontweight='bold')
        ax1.set_xlabel("Stride Length (m)")
        ax1.set_ylabel("Frequency")
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        
        # Box plot
        ax2.boxplot(stride_lengths, patch_artist=True, 
                   boxprops=dict(facecolor='lightgreen', alpha=0.7))
        ax2.set_title("Stride Length Variability", fontweight='bold')
        ax2.set_ylabel("Stride Length (m)")
        ax2.set_xticklabels(['All Strides'])
        ax2.grid(True, alpha=0.3)
        
        # Add statistics
        stats = {
            'Mean': np.mean(stride_lengths),
            'Median': np.median(stride_lengths),
            'Std': np.std(stride_lengths),
            'Min': np.min(stride_lengths),
            'Max': np.max(stride_lengths)
        }
        
        stats_text = '\n'.join([f"{k}: {v:.3f}m" for k, v in stats.items()])
        ax2.text(1.1, 0.5, stats_text, transform=ax2.transAxes,
                bbox=dict(boxstyle='round', facecolor='white', alpha=0.8),
                verticalalignment='center')
        
        plt.suptitle(f"Stride Length Analysis - Session {session_id}", 
                    fontweight='bold', fontsize=16)
        plt.tight_layout()
        
        filename = f"{self.output_dir}/stride_distribution_{session_id}.{self.save_format}"
        plt.savefig(filename, dpi=150, bbox_inches='tight')
        plt.close()
        
        return filename
    
    def plot_force_distribution(self, df_processed, session_id):
        """NEW: Force distribution across foot regions"""
        regions = ['forefoot', 'midfoot', 'rearfoot']
        region_data = []
        region_labels = []
        
        for region in regions:
            if region in df_processed.columns:
                region_data.append(df_processed[region].values)
                region_labels.append(region.capitalize())
        
        if not region_data:
            return None
        
        plt.figure(figsize=(12, 8))
        
        # Create violin plot
        parts = plt.violinplot(region_data, positions=range(1, len(region_data)+1), 
                              showmeans=True, showmedians=True)
        
        # Color the violins
        colors = ['lightcoral', 'lightblue', 'lightgreen']
        for i, pc in enumerate(parts['bodies']):
            pc.set_facecolor(colors[i % len(colors)])
            pc.set_alpha(0.7)
        
        plt.title(f"Force Distribution Across Foot Regions - Session {session_id}", 
                 fontweight='bold', fontsize=14)
        plt.xlabel("Foot Region")
        plt.ylabel("Pressure (ADC units)")
        plt.xticks(range(1, len(region_labels)+1), region_labels)
        plt.grid(True, alpha=0.3, axis='y')
        
        # Add mean values as text
        for i, data in enumerate(region_data):
            mean_val = np.mean(data)
            plt.text(i+1, mean_val, f'{mean_val:.0f}', ha='center', va='bottom',
                    fontweight='bold', bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))
        
        plt.tight_layout()
        
        filename = f"{self.output_dir}/force_distribution_{session_id}.{self.save_format}"
        plt.savefig(filename, dpi=150, bbox_inches='tight')
        plt.close()
        
        return filename
    
    def plot_session_summary(self, analysis_result: Dict, df_processed, session_id):
        """NEW: Comprehensive session summary dashboard"""
        fig = plt.figure(figsize=(16, 12))
        
        # Create a 3x3 grid
        gs = fig.add_gridspec(3, 3, hspace=0.3, wspace=0.3)
        
        # 1. Key Metrics (top left)
        ax1 = fig.add_subplot(gs[0, 0])
        metrics = [
            f"Distance: {analysis_result.get('distance_meters', 0):.1f}m",
            f"Steps: {analysis_result.get('num_strides', 0)}",
            f"Avg Stride: {analysis_result.get('avg_stride_length_meters', 0):.2f}m",
            f"Cadence: {analysis_result.get('estimated_cadence', 0):.0f} spm",
            f"Duration: {analysis_result.get('session_duration_seconds', 0):.1f}s",
            f"Method: {analysis_result.get('method_used', 'Unknown')}",
            f"Confidence: {analysis_result.get('confidence_level', 'Unknown')}"
        ]
        
        for i, metric in enumerate(metrics):
            ax1.text(0.1, 0.9 - i*0.12, metric, fontsize=11, fontweight='bold',
                    transform=ax1.transAxes)
        ax1.set_xlim(0, 1)
        ax1.set_ylim(0, 1)
        ax1.axis('off')
        ax1.set_title("Session Metrics", fontweight='bold')
        
        # 2. Stride lengths over time (top middle and right)
        ax2 = fig.add_subplot(gs[0, 1:])
        if 'stride_lengths' in analysis_result and analysis_result['stride_lengths']:
            stride_lengths = analysis_result['stride_lengths']
            stride_nums = list(range(1, len(stride_lengths) + 1))
            ax2.plot(stride_nums, stride_lengths, 'o-', color='teal', linewidth=2, markersize=4)
            ax2.axhline(np.mean(stride_lengths), color='red', linestyle='--', 
                       label=f'Mean: {np.mean(stride_lengths):.2f}m')
            ax2.set_title("Stride Length Progression", fontweight='bold')
            ax2.set_xlabel("Stride Number")
            ax2.set_ylabel("Length (m)")
            ax2.legend()
            ax2.grid(True, alpha=0.3)
        
        # 3. Region pressure over time (middle row)
        ax3 = fig.add_subplot(gs[1, :])
        regions = ['forefoot', 'midfoot', 'rearfoot']
        colors = ['red', 'blue', 'green']
        
        for region, color in zip(regions, colors):
            if region in df_processed.columns:
                ax3.plot(df_processed['rel_time_ms'], df_processed[region], 
                        label=region.capitalize(), color=color, alpha=0.7)
        
        ax3.set_title("Pressure Distribution Over Time", fontweight='bold')
        ax3.set_xlabel("Time (ms)")
        ax3.set_ylabel("Pressure (ADC units)")
        ax3.legend()
        ax3.grid(True, alpha=0.3)
        
        # 4. Method comparison (bottom left)
        ax4 = fig.add_subplot(gs[2, 0])
        if 'all_method_results' in analysis_result:
            methods = list(analysis_result['all_method_results'].keys())
            distances = list(analysis_result['all_method_results'].values())
            colors = ['lightcoral', 'skyblue', 'lightgreen', 'gold']
            
            bars = ax4.bar(range(len(methods)), distances, color=colors)
            ax4.set_title("Method Comparison", fontweight='bold')
            ax4.set_ylabel("Distance (m)")
            ax4.set_xticks(range(len(methods)))
            ax4.set_xticklabels([m.split()[0] for m in methods], rotation=45, ha='right')
            
            # Highlight best method
            best_method = analysis_result.get('method_used', '')
            for i, method in enumerate(methods):
                if method == best_method:
                    bars[i].set_color('darkgreen')
        
        # 5. Data quality metrics (bottom middle)
        ax5 = fig.add_subplot(gs[2, 1])
        quality_metrics = [
            f"Data Points: {analysis_result.get('data_points', 0)}",
            f"Sampling Rate: {analysis_result.get('sampling_rate_hz', 0):.1f} Hz",
            f"Valid IC Events: {analysis_result.get('num_initial_contacts', 0)}",
            f"Calibration Factor: {analysis_result.get('calibration_factor', 1.0):.3f}"
        ]
        
        for i, metric in enumerate(quality_metrics):
            ax5.text(0.1, 0.8 - i*0.2, metric, fontsize=10, transform=ax5.transAxes)
        ax5.set_xlim(0, 1)
        ax5.set_ylim(0, 1)
        ax5.axis('off')
        ax5.set_title("Data Quality", fontweight='bold')
        
        # 6. Session timestamp (bottom right)
        ax6 = fig.add_subplot(gs[2, 2])
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        session_info = [
            f"Session ID: {session_id}",
            f"Generated: {timestamp}",
            f"Plot Version: 1.0"
        ]
        
        for i, info in enumerate(session_info):
            ax6.text(0.1, 0.7 - i*0.2, info, fontsize=10, transform=ax6.transAxes)
        ax6.set_xlim(0, 1)
        ax6.set_ylim(0, 1)
        ax6.axis('off')
        ax6.set_title("Session Info", fontweight='bold')
        
        plt.suptitle(f"Gait Analysis Summary - Session {session_id}", 
                    fontsize=18, fontweight='bold')
        
        filename = f"{self.output_dir}/session_summary_{session_id}.{self.save_format}"
        plt.savefig(filename, dpi=150, bbox_inches='tight')
        plt.close()
        
        return filename
    
    def cleanup_old_plots(self, max_age_hours: int = 24):
        """Clean up old plot files to prevent disk space issues"""
        import time
        
        current_time = time.time()
        cutoff_time = current_time - (max_age_hours * 3600)
        
        try:
            for filename in os.listdir(self.output_dir):
                filepath = os.path.join(self.output_dir, filename)
                if os.path.isfile(filepath) and os.path.getmtime(filepath) < cutoff_time:
                    os.remove(filepath)
                    print(f"🗑️ Cleaned up old plot: {filename}")
        except Exception as e:
            print(f"⚠️ Error during plot cleanup: {e}")

# ============================================================================
# Integration function for GaitProcessor
# ============================================================================

def generate_session_plots(session_id: str, df_processed, gait_events: Dict, 
                          analysis_result: Dict, valid_stride_times: List = None) -> str:
    """
    Convenience function to generate all plots for a session
    Returns the main summary plot path for inclusion in API response
    """
    try:
        viz_engine = GaitVisualizationEngine()
        plot_files = viz_engine.generate_all_plots(
            session_id, df_processed, gait_events, analysis_result, valid_stride_times
        )
        
        # Clean up old plots to prevent disk buildup
        viz_engine.cleanup_old_plots(max_age_hours=24)
        
        # Return the main summary plot path
        return plot_files.get("session_summary", "")
        
    except Exception as e:
        print(f"❌ Error generating session plots: {e}")
        return ""
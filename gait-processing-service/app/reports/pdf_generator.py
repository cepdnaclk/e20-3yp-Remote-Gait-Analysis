# ============================================================================
# FILE: app/reports/pdf_generator.py (NEW FILE)
# ============================================================================

import os
import numpy as np
from datetime import datetime
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfgen import canvas
from typing import Dict, List, Optional
import tempfile
from io import BytesIO

class GaitAnalysisPDFReport:
    """
    Professional PDF report generator for gait analysis sessions
    Combines all visualization plots into a comprehensive report
    """
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
    
    def setup_custom_styles(self):
        """Setup custom paragraph styles for the report"""
        # Title style
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Title'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.darkblue
        )
        
        # Header style
        self.header_style = ParagraphStyle(
            'CustomHeader',
            parent=self.styles['Heading1'],
            fontSize=16,
            spaceAfter=12,
            spaceBefore=20,
            textColor=colors.darkblue,
            borderWidth=1,
            borderColor=colors.darkblue,
            borderPadding=5
        )
        
        # Subheader style
        self.subheader_style = ParagraphStyle(
            'CustomSubHeader',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceAfter=8,
            spaceBefore=15,
            textColor=colors.darkred
        )
        
        # Normal text style
        self.normal_style = ParagraphStyle(
            'CustomNormal',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceAfter=6,
            alignment=TA_LEFT
        )
        
        # Metrics style
        self.metrics_style = ParagraphStyle(
            'MetricsStyle',
            parent=self.styles['Normal'],
            fontSize=12,
            spaceAfter=4,
            leftIndent=20,
            fontName='Helvetica-Bold'
        )
    
    def generate_report(self, session_id: str, analysis_result: Dict, 
                       plot_files: Dict[str, str], df_processed=None, patient_info: Dict = None) -> str:
        """
        Generate complete PDF report (returns local file path)
        
        Args:
            session_id: Session identifier
            analysis_result: Results from gait analysis
            plot_files: Dictionary mapping plot names to file paths
            df_processed: Processed dataframe for additional metrics
            patient_info: Patient information from SQS message
            
        Returns:
            Local path to the generated PDF file
        """
        try:
            # Create temporary PDF file
            with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_file:
                pdf_path = temp_file.name
            
            # Generate PDF content
            doc = SimpleDocTemplate(
                pdf_path,
                pagesize=A4,
                rightMargin=72,
                leftMargin=72,
                topMargin=72,
                bottomMargin=18
            )
            
            # Build story (content)
            story = []
            
            # 1. Title Page
            story.extend(self._create_title_page(session_id, analysis_result, patient_info))
            story.append(PageBreak())
            
            # 2. Executive Summary
            story.extend(self._create_executive_summary(analysis_result, df_processed, patient_info))
            story.append(PageBreak())
            
            # 3. Detailed Analysis with Plots
            story.extend(self._create_detailed_analysis(plot_files, analysis_result))
            
            # 4. Data Quality & Methodology
            story.append(PageBreak())
            story.extend(self._create_methodology_section(analysis_result))
            
            # 5. Appendix
            story.append(PageBreak())
            story.extend(self._create_appendix(analysis_result, df_processed))
            
            # Build PDF
            doc.build(story, onFirstPage=self._add_header_footer, 
                     onLaterPages=self._add_header_footer)
            
            print(f"📄 PDF report generated: {pdf_path}")
            return pdf_path
            
        except Exception as e:
            print(f"❌ Error generating PDF report: {e}")
            return ""
    
    def _create_title_page(self, session_id: str, analysis_result: Dict, patient_info: Dict = None) -> List:
        """Create title page content"""
        story = []
        
        # Main title
        story.append(Spacer(1, 1.5*inch))
        story.append(Paragraph("GAIT ANALYSIS REPORT", self.title_style))
        story.append(Spacer(1, 0.3*inch))
        
        # Patient information section
        if patient_info:
            story.append(Paragraph("Patient Information", self.subheader_style))
            
            patient_data = [
                ["Field", "Value"],
                ["Patient Name", patient_info.get('name', 'N/A')],
                ["Patient ID", str(patient_info.get('id', 'N/A'))],
                ["Age", f"{patient_info.get('age', 'N/A')} years"],
                ["Gender", patient_info.get('gender', 'N/A')],
                ["Height", f"{patient_info.get('height', 'N/A')} cm"],
                ["Weight", f"{patient_info.get('weight', 'N/A')} kg"],
                ["Doctor", patient_info.get('doctorName', 'N/A')],
                ["Contact", patient_info.get('phoneNumber', 'N/A')]
            ]
            
            patient_table = Table(patient_data, colWidths=[2*inch, 3*inch])
            patient_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.lightblue),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 11),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE')
            ]))
            
            story.append(patient_table)
            story.append(Spacer(1, 0.3*inch))
        
        # Session info
        story.append(Paragraph(f"Session ID: {session_id}", self.subheader_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Key metrics table
        key_metrics = [
            ["Metric", "Value"],
            ["Total Distance", f"{analysis_result.get('distance_meters', 0):.1f} meters"],
            ["Number of Strides", f"{analysis_result.get('num_strides', 0)}"],
            ["Average Stride Length", f"{analysis_result.get('avg_stride_length_meters', 0):.2f} meters"],
            ["Session Duration", f"{analysis_result.get('session_duration_seconds', 0):.1f} seconds"],
            ["Analysis Method", f"{analysis_result.get('method_used', 'Unknown')}"],
            ["Confidence Level", f"{analysis_result.get('confidence_level', 'Unknown')}"]
        ]
        
        metrics_table = Table(key_metrics, colWidths=[3*inch, 2*inch])
        metrics_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(metrics_table)
        story.append(Spacer(1, 0.5*inch))
        
        # Generation info
        timestamp = datetime.now().strftime("%B %d, %Y at %I:%M %p")
        story.append(Paragraph(f"Generated on: {timestamp}", self.normal_style))
        story.append(Paragraph("Powered by Advanced Gait Analysis System", self.normal_style))
        
        return story
    
    def _create_executive_summary(self, analysis_result: Dict, df_processed=None, patient_info: Dict = None) -> List:
        """Create executive summary section"""
        story = []
        
        story.append(Paragraph("EXECUTIVE SUMMARY", self.header_style))
        
        # Patient context (if available)
        if patient_info:
            patient_context = f"""
            This gait analysis was performed for {patient_info.get('name', 'the patient')}, 
            a {patient_info.get('age', 'N/A')}-year-old {patient_info.get('gender', '').lower()} patient 
            under the care of {patient_info.get('doctorName', 'the attending physician')}.
            """
            story.append(Paragraph(patient_context, self.normal_style))
            story.append(Spacer(1, 10))
        
        # Performance overview
        distance = analysis_result.get('distance_meters', 0)
        stride_length = analysis_result.get('avg_stride_length_meters', 0)
        duration = analysis_result.get('session_duration_seconds', 0)
        method = analysis_result.get('method_used', 'Unknown')
        
        summary_text = f"""
        This gait analysis session covered a total distance of {distance:.1f} meters 
        over {duration:.1f} seconds. The analysis identified {analysis_result.get('num_strides', 0)} 
        complete strides with an average stride length of {stride_length:.2f} meters.
        
        The analysis was performed using the {method} approach, which provided 
        {analysis_result.get('confidence_level', 'moderate')} confidence in the results.
        """
        
        story.append(Paragraph(summary_text, self.normal_style))
        story.append(Spacer(1, 20))
        
        # Key findings
        story.append(Paragraph("Key Findings:", self.subheader_style))
        
        # Calculate some derived metrics
        if duration > 0:
            avg_speed = distance / duration * 3.6  # Convert m/s to km/h
            story.append(Paragraph(f"• Average walking speed: {avg_speed:.1f} km/h", self.normal_style))
        
        if 'stride_lengths' in analysis_result and analysis_result['stride_lengths']:
            stride_lengths = analysis_result['stride_lengths']
            cv = (np.std(stride_lengths) / np.mean(stride_lengths)) * 100
            story.append(Paragraph(f"• Stride length variability (CV): {cv:.1f}%", self.normal_style))
        
        story.append(Paragraph(f"• Dominant foot pattern detected", self.normal_style))
        story.append(Paragraph(f"• Data quality: {analysis_result.get('data_points', 0)} sensor readings processed", self.normal_style))
        
        return story
    
    def _create_detailed_analysis(self, plot_files: Dict[str, str], analysis_result: Dict) -> List:
        """Create detailed analysis section with plots"""
        story = []
        
        story.append(Paragraph("DETAILED ANALYSIS", self.header_style))
        
        # Plot sections in logical order
        plot_sections = [
            ("session_summary", "Session Overview", 
             "Comprehensive overview of all key metrics and trends from the gait analysis session."),
            ("gait_events", "Gait Event Detection", 
             "Detailed view of initial contact and toe-off detection across different sensor signals."),
            ("stride_times", "Stride Time Analysis", 
             "Temporal analysis showing stride-to-stride timing variability and consistency."),
            ("stride_distribution", "Stride Length Distribution", 
             "Statistical distribution of stride lengths with variability metrics."),
            ("method_comparison", "Method Comparison", 
             "Comparison of different distance estimation methods used in the analysis."),
            ("pressure_heatmap", "Pressure Distribution", 
             "Spatial and temporal pressure distribution across all foot sensors."),
            ("force_distribution", "Force Analysis", 
             "Distribution of forces across different regions of the foot during walking.")
        ]
        
        for plot_key, title, description in plot_sections:
            if plot_key in plot_files and plot_files[plot_key] and os.path.exists(plot_files[plot_key]):
                story.append(Paragraph(title, self.subheader_style))
                story.append(Paragraph(description, self.normal_style))
                story.append(Spacer(1, 10))
                
                # Add plot image
                try:
                    img = Image(plot_files[plot_key])
                    img.drawHeight = 4*inch  # Adjust as needed
                    img.drawWidth = 6*inch
                    story.append(img)
                    story.append(Spacer(1, 15))
                except Exception as e:
                    story.append(Paragraph(f"[Plot could not be loaded: {e}]", self.normal_style))
                    story.append(Spacer(1, 10))
        
        return story
    
    def _create_methodology_section(self, analysis_result: Dict) -> List:
        """Create methodology and data quality section"""
        story = []
        
        story.append(Paragraph("METHODOLOGY & DATA QUALITY", self.header_style))
        
        # Analysis method
        story.append(Paragraph("Analysis Method", self.subheader_style))
        method_text = f"""
        This analysis used the {analysis_result.get('method_used', 'hybrid')} approach for 
        stride length estimation. The method was selected based on data quality metrics 
        and confidence scores across multiple algorithmic approaches.
        """
        story.append(Paragraph(method_text, self.normal_style))
        
        # Data quality metrics
        story.append(Paragraph("Data Quality Metrics", self.subheader_style))
        
        quality_data = [
            ["Metric", "Value"],
            ["Total Data Points", f"{analysis_result.get('data_points', 0):,}"],
            ["Sampling Rate", f"{analysis_result.get('sampling_rate_hz', 0):.1f} Hz"],
            ["Valid Initial Contacts", f"{analysis_result.get('num_initial_contacts', 0)}"],
            ["Calibration Factor", f"{analysis_result.get('calibration_factor', 1.0):.3f}"],
            ["Analysis Confidence", f"{analysis_result.get('confidence_level', 'Unknown')}"]
        ]
        
        quality_table = Table(quality_data, colWidths=[2.5*inch, 2*inch])
        quality_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightblue),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(quality_table)
        story.append(Spacer(1, 20))
        
        # Algorithm details
        story.append(Paragraph("Algorithm Details", self.subheader_style))
        algo_text = """
        The gait analysis system employs multiple complementary algorithms:
        
        • ZUPT (Zero Velocity Update) Method: Uses inertial sensor data to detect stationary phases
        • Step Detection Algorithm: Identifies discrete footstep events from pressure sensors
        • Pendulum Model: Biomechanical model based on leg swing dynamics
        • Hybrid Approach: Combines multiple methods for optimal accuracy
        
        The system automatically selects the most appropriate method based on signal quality 
        and consistency metrics.
        """
        story.append(Paragraph(algo_text, self.normal_style))
        
        return story
    
    def _create_appendix(self, analysis_result: Dict, df_processed=None) -> List:
        """Create appendix with additional technical details"""
        story = []
        
        story.append(Paragraph("APPENDIX", self.header_style))
        
        # Technical specifications
        story.append(Paragraph("Technical Specifications", self.subheader_style))
        
        tech_specs = [
            ["Component", "Specification"],
            ["Pressure Sensors", "16-channel FSR array"],
            ["IMU Sensors", "3-axis accelerometer, gyroscope"],
            ["Sampling Rate", f"{analysis_result.get('sampling_rate_hz', 50):.1f} Hz"],
            ["Processing Algorithm", "Real-time gait event detection"],
            ["Calibration", "Multi-method validation approach"]
        ]
        
        tech_table = Table(tech_specs, colWidths=[2.5*inch, 3*inch])
        tech_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(tech_table)
        story.append(Spacer(1, 20))
        
        # Raw data summary
        if df_processed is not None:
            story.append(Paragraph("Raw Data Summary", self.subheader_style))
            
            # Calculate some basic statistics
            data_summary = f"""
            Total sensor readings: {len(df_processed):,}
            Duration: {analysis_result.get('session_duration_seconds', 0):.1f} seconds
            Active sensors: {len([col for col in df_processed.columns if col.startswith('FSR_')])}
            Data completeness: {(1 - df_processed.isnull().sum().sum() / df_processed.size) * 100:.1f}%
            """
            story.append(Paragraph(data_summary, self.normal_style))
        
        # Disclaimer
        story.append(Spacer(1, 30))
        story.append(Paragraph("Disclaimer", self.subheader_style))
        disclaimer_text = """
        This report is generated by an automated gait analysis system for research and 
        clinical assessment purposes. Results should be interpreted by qualified professionals 
        in conjunction with clinical examination and other diagnostic methods.
        """
        story.append(Paragraph(disclaimer_text, self.normal_style))
        
        return story
    
    def _add_header_footer(self, canvas, doc):
        """Add header and footer to each page"""
        canvas.saveState()
        
        # Header
        canvas.setFont('Helvetica-Bold', 9)
        canvas.drawString(inch, doc.height + 0.5*inch, "Gait Analysis Report")
        canvas.drawRightString(doc.width + inch, doc.height + 0.5*inch, 
                              datetime.now().strftime("%Y-%m-%d"))
        
        # Footer
        canvas.setFont('Helvetica', 8)
        canvas.drawString(inch, 0.5*inch, "Confidential - For Medical Use Only")
        canvas.drawRightString(doc.width + inch, 0.5*inch, f"Page {doc.page}")
        
        canvas.restoreState()

# ============================================================================
# Integration function for GaitProcessor
# ============================================================================

def generate_pdf_report(session_id: str, analysis_result: Dict, plot_files: Dict[str, str], 
                       df_processed=None, patient_info: Dict = None) -> str:
    """
    Convenience function to generate PDF report
    
    Args:
        session_id: Session identifier
        analysis_result: Results from gait analysis
        plot_files: Dictionary of plot file paths
        df_processed: Processed dataframe
        patient_info: Patient information from SQS message
        
    Returns:
        Local path to the generated PDF file
    """
    try:
        pdf_generator = GaitAnalysisPDFReport()
        pdf_path = pdf_generator.generate_report(
            session_id, analysis_result, plot_files, df_processed, patient_info
        )
        return pdf_path
        
    except Exception as e:
        print(f"❌ Error in PDF report generation: {e}")
        return ""
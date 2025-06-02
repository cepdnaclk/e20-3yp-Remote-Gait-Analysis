# ============================================================================
# FILE: app/services/s3_service.py (UPDATED FOR ACCESS KEYS)
# ============================================================================

import boto3
import os
from datetime import datetime
from typing import Optional, Dict, Any
from botocore.exceptions import ClientError, NoCredentialsError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class S3Service:
    """
    Centralized S3 service for handling all file uploads and operations
    Uses IAM user with access keys (same pattern as SQS)
    """
    
    def __init__(self, bucket_name: str = "gait-analysis-reports"):
        """
        Initialize S3 service with access keys from environment
        
        Args:
            bucket_name: Name of the S3 bucket
        """
        self.bucket_name = bucket_name
        self.region = os.getenv("AWS_REGION", "us-east-1")
        self.access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
        self.secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        self.s3_client = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize S3 client with access keys (same pattern as SQS)"""
        try:
            if not self.access_key_id or not self.secret_access_key:
                print("❌ AWS credentials not found in environment variables")
                self.s3_client = None
                return
            
            self.s3_client = boto3.client(
                's3',
                aws_access_key_id=self.access_key_id,
                aws_secret_access_key=self.secret_access_key,
                region_name=self.region
            )
            
            # Test connection by checking if bucket exists
            self.s3_client.head_bucket(Bucket=self.bucket_name)
            print(f"✅ S3 service initialized for bucket: {self.bucket_name}")
            
        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == '404':
                print(f"⚠️ Bucket {self.bucket_name} not found. Attempting to create...")
                self._create_bucket_if_not_exists()
            elif error_code == '403':
                print(f"❌ Access denied to bucket {self.bucket_name}. Check IAM permissions.")
                self.s3_client = None
            else:
                print(f"❌ S3 initialization error: {e}")
                self.s3_client = None
        except Exception as e:
            print(f"❌ Unexpected S3 error: {e}")
            self.s3_client = None
    
    def _create_bucket_if_not_exists(self):
        """Create S3 bucket if it doesn't exist"""
        try:
            if self.region == 'us-east-1':
                # us-east-1 doesn't need LocationConstraint
                self.s3_client.create_bucket(Bucket=self.bucket_name)
            else:
                self.s3_client.create_bucket(
                    Bucket=self.bucket_name,
                    CreateBucketConfiguration={'LocationConstraint': self.region}
                )
            print(f"✅ Created S3 bucket: {self.bucket_name}")
        except Exception as e:
            print(f"❌ Failed to create bucket: {e}")
    
    def is_available(self) -> bool:
        """Check if S3 service is available"""
        return self.s3_client is not None
    
    def upload_pdf_report(self, local_file_path: str, session_id: str) -> str:
        """
        Upload PDF report to S3
        
        Args:
            local_file_path: Path to the local PDF file
            session_id: Session identifier
            
        Returns:
            S3 URL of the uploaded PDF or empty string if failed
        """
        if not self.is_available():
            print("❌ S3 service not available for PDF upload")
            return ""
        
        try:
            # Generate S3 key with timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            s3_key = f"reports/gait_analysis_session_{session_id}_{timestamp}.pdf"
            
            # Upload file with metadata
            self.s3_client.upload_file(
                local_file_path,
                self.bucket_name,
                s3_key,
                ExtraArgs={
                    'ContentType': 'application/pdf',
                    'ContentDisposition': f'inline; filename="gait_report_{session_id}.pdf"',
                    'Metadata': {
                        'session_id': str(session_id),
                        'generated_at': datetime.now().isoformat(),
                        'report_type': 'gait_analysis',
                        'file_type': 'pdf_report'
                    }
                }
            )
            
            # Generate public URL
            s3_url = f"https://{self.bucket_name}.s3.amazonaws.com/{s3_key}"
            print(f"📤 PDF report uploaded: {s3_url}")
            return s3_url
            
        except Exception as e:
            print(f"❌ PDF upload failed: {e}")
            return ""
    
    def upload_plot_image(self, local_file_path: str, session_id: str, plot_type: str = "summary") -> str:
        """
        Upload plot image to S3
        
        Args:
            local_file_path: Path to the local image file
            session_id: Session identifier
            plot_type: Type of plot (e.g., "summary", "heatmap", "gait_events")
            
        Returns:
            S3 URL of the uploaded image or empty string if failed
        """
        if not self.is_available():
            print("❌ S3 service not available for plot upload")
            return ""
        
        try:
            # Generate S3 key
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            file_extension = os.path.splitext(local_file_path)[1]
            s3_key = f"plots/session_{session_id}_{plot_type}_{timestamp}{file_extension}"
            
            # Upload file
            self.s3_client.upload_file(
                local_file_path,
                self.bucket_name,
                s3_key,
                ExtraArgs={
                    'ContentType': 'image/png',
                    'Metadata': {
                        'session_id': str(session_id),
                        'generated_at': datetime.now().isoformat(),
                        'plot_type': plot_type,
                        'file_type': 'plot_image'
                    }
                }
            )
            
            # Generate public URL
            s3_url = f"https://{self.bucket_name}.s3.amazonaws.com/{s3_key}"
            print(f"📈 Plot uploaded: {s3_url}")
            return s3_url
            
        except Exception as e:
            print(f"❌ Plot upload failed: {e}")
            return ""
    
    def get_latest_report_url(self, session_id: str) -> str:
        """
        Get the most recent PDF report URL for a session
        
        Args:
            session_id: Session identifier
            
        Returns:
            S3 URL of the latest report or empty string if not found
        """
        if not self.is_available():
            return ""
        
        try:
            # List objects with session prefix
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=f"reports/gait_analysis_session_{session_id}_"
            )
            
            if 'Contents' in response and response['Contents']:
                # Get the most recent file
                latest_object = max(response['Contents'], key=lambda x: x['LastModified'])
                s3_key = latest_object['Key']
                return f"https://{self.bucket_name}.s3.amazonaws.com/{s3_key}"
            
            return ""
            
        except Exception as e:
            print(f"❌ Error retrieving report URL: {e}")
            return ""
    
    def delete_old_files(self, prefix: str, max_age_hours: int = 24) -> int:
        """
        Delete old files from S3 to manage storage costs
        
        Args:
            prefix: S3 key prefix to filter files
            max_age_hours: Maximum age of files to keep
            
        Returns:
            Number of files deleted
        """
        if not self.is_available():
            return 0
        
        try:
            from datetime import timedelta
            cutoff_time = datetime.now() - timedelta(hours=max_age_hours)
            
            # List objects
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix
            )
            
            deleted_count = 0
            if 'Contents' in response:
                for obj in response['Contents']:
                    if obj['LastModified'].replace(tzinfo=None) < cutoff_time:
                        self.s3_client.delete_object(
                            Bucket=self.bucket_name,
                            Key=obj['Key']
                        )
                        deleted_count += 1
                        print(f"🗑️ Deleted old file: {obj['Key']}")
            
            return deleted_count
            
        except Exception as e:
            print(f"❌ Error during cleanup: {e}")
            return 0
    
    def upload_file_with_fallback(self, local_file_path: str, session_id: str, 
                                 file_type: str = "report") -> str:
        """
        Upload file with fallback to local path if S3 fails
        
        Args:
            local_file_path: Path to the local file
            session_id: Session identifier
            file_type: Type of file ("report", "plot", etc.)
            
        Returns:
            S3 URL if successful, local path if S3 fails, placeholder if all fails
        """
        if file_type == "report":
            s3_url = self.upload_pdf_report(local_file_path, session_id)
            if s3_url:
                return s3_url
            else:
                # Fallback to local path (for development)
                return f"/api/reports/session_{session_id}.pdf"
        
        elif file_type == "plot":
            s3_url = self.upload_plot_image(local_file_path, session_id)
            if s3_url:
                return s3_url
            else:
                # Fallback to local path
                return f"/api/plots/session_{session_id}_summary.png"
        
        # Ultimate fallback
        return f"s3://{self.bucket_name}/placeholder/session_{session_id}.{file_type}"
    
    def get_bucket_info(self) -> Dict[str, Any]:
        """
        Get information about the S3 bucket
        
        Returns:
            Dictionary with bucket information
        """
        info = {
            "bucket_name": self.bucket_name,
            "region": self.region,
            "available": self.is_available(),
            "total_objects": 0,
            "total_size_mb": 0,
            "credentials_configured": bool(self.access_key_id and self.secret_access_key)
        }
        
        if not self.is_available():
            return info
        
        try:
            # Get bucket statistics
            response = self.s3_client.list_objects_v2(Bucket=self.bucket_name)
            
            if 'Contents' in response:
                info["total_objects"] = len(response['Contents'])
                total_size = sum(obj['Size'] for obj in response['Contents'])
                info["total_size_mb"] = round(total_size / (1024 * 1024), 2)
            
        except Exception as e:
            print(f"⚠️ Error getting bucket info: {e}")
        
        return info

# ============================================================================
# Factory function for easy instantiation
# ============================================================================

def create_s3_service(bucket_name: str = "gait-analysis-reports") -> S3Service:
    """
    Factory function to create S3 service instance
    Uses the same access key pattern as SQS
    
    Args:
        bucket_name: Name of the S3 bucket
        
    Returns:
        Configured S3Service instance
    """
    return S3Service(bucket_name=bucket_name)

# ============================================================================
# Test function to verify S3 setup
# ============================================================================

def test_s3_connection():
    """
    Test S3 connection and permissions
    Call this function to verify your setup
    """
    print("🧪 Testing S3 connection...")
    
    s3_service = create_s3_service()
    
    if not s3_service.is_available():
        print("❌ S3 service not available. Check:")
        print("   - AWS_ACCESS_KEY_ID in .env file")
        print("   - AWS_SECRET_ACCESS_KEY in .env file") 
        print("   - AWS_REGION in .env file")
        print("   - IAM user has S3 permissions")
        return False
    
    # Test bucket access
    bucket_info = s3_service.get_bucket_info()
    print(f"✅ S3 connection successful!")
    print(f"   Bucket: {bucket_info['bucket_name']}")
    print(f"   Region: {bucket_info['region']}")
    print(f"   Objects: {bucket_info['total_objects']}")
    print(f"   Size: {bucket_info['total_size_mb']} MB")
    
    return True

if __name__ == "__main__":
    # Run test when called directly
    test_s3_connection()
    
    def _create_bucket_if_not_exists(self):
        """Create S3 bucket if it doesn't exist"""
        try:
            if self.region == 'us-east-1':
                # us-east-1 doesn't need LocationConstraint
                self.s3_client.create_bucket(Bucket=self.bucket_name)
            else:
                self.s3_client.create_bucket(
                    Bucket=self.bucket_name,
                    CreateBucketConfiguration={'LocationConstraint': self.region}
                )
            print(f"✅ Created S3 bucket: {self.bucket_name}")
        except Exception as e:
            print(f"❌ Failed to create bucket: {e}")
    
    def is_available(self) -> bool:
        """Check if S3 service is available"""
        return self.s3_client is not None
    
    def upload_pdf_report(self, local_file_path: str, session_id: str) -> str:
        """
        Upload PDF report to S3
        
        Args:
            local_file_path: Path to the local PDF file
            session_id: Session identifier
            
        Returns:
            S3 URL of the uploaded PDF or empty string if failed
        """
        if not self.is_available():
            print("❌ S3 service not available for PDF upload")
            return ""
        
        try:
            # Generate S3 key with timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            s3_key = f"reports/gait_analysis_session_{session_id}_{timestamp}.pdf"
            
            # Upload file with metadata
            self.s3_client.upload_file(
                local_file_path,
                self.bucket_name,
                s3_key,
                ExtraArgs={
                    'ContentType': 'application/pdf',
                    'ContentDisposition': f'inline; filename="gait_report_{session_id}.pdf"',
                    'Metadata': {
                        'session_id': str(session_id),
                        'generated_at': datetime.now().isoformat(),
                        'report_type': 'gait_analysis',
                        'file_type': 'pdf_report'
                    }
                }
            )
            
            # Generate public URL
            s3_url = f"https://{self.bucket_name}.s3.amazonaws.com/{s3_key}"
            print(f"📤 PDF report uploaded: {s3_url}")
            return s3_url
            
        except Exception as e:
            print(f"❌ PDF upload failed: {e}")
            return ""
    
    def upload_plot_image(self, local_file_path: str, session_id: str, plot_type: str = "summary") -> str:
        """
        Upload plot image to S3
        
        Args:
            local_file_path: Path to the local image file
            session_id: Session identifier
            plot_type: Type of plot (e.g., "summary", "heatmap", "gait_events")
            
        Returns:
            S3 URL of the uploaded image or empty string if failed
        """
        if not self.is_available():
            print("❌ S3 service not available for plot upload")
            return ""
        
        try:
            # Generate S3 key
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            file_extension = os.path.splitext(local_file_path)[1]
            s3_key = f"plots/session_{session_id}_{plot_type}_{timestamp}{file_extension}"
            
            # Upload file
            self.s3_client.upload_file(
                local_file_path,
                self.bucket_name,
                s3_key,
                ExtraArgs={
                    'ContentType': 'image/png',
                    'Metadata': {
                        'session_id': str(session_id),
                        'generated_at': datetime.now().isoformat(),
                        'plot_type': plot_type,
                        'file_type': 'plot_image'
                    }
                }
            )
            
            # Generate public URL
            s3_url = f"https://{self.bucket_name}.s3.amazonaws.com/{s3_key}"
            print(f"📈 Plot uploaded: {s3_url}")
            return s3_url
            
        except Exception as e:
            print(f"❌ Plot upload failed: {e}")
            return ""
    
    def get_latest_report_url(self, session_id: str) -> str:
        """
        Get the most recent PDF report URL for a session
        
        Args:
            session_id: Session identifier
            
        Returns:
            S3 URL of the latest report or empty string if not found
        """
        if not self.is_available():
            return ""
        
        try:
            # List objects with session prefix
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=f"reports/gait_analysis_session_{session_id}_"
            )
            
            if 'Contents' in response and response['Contents']:
                # Get the most recent file
                latest_object = max(response['Contents'], key=lambda x: x['LastModified'])
                s3_key = latest_object['Key']
                return f"https://{self.bucket_name}.s3.amazonaws.com/{s3_key}"
            
            return ""
            
        except Exception as e:
            print(f"❌ Error retrieving report URL: {e}")
            return ""
    
    def delete_old_files(self, prefix: str, max_age_hours: int = 24) -> int:
        """
        Delete old files from S3 to manage storage costs
        
        Args:
            prefix: S3 key prefix to filter files
            max_age_hours: Maximum age of files to keep
            
        Returns:
            Number of files deleted
        """
        if not self.is_available():
            return 0
        
        try:
            from datetime import timedelta
            cutoff_time = datetime.now() - timedelta(hours=max_age_hours)
            
            # List objects
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix
            )
            
            deleted_count = 0
            if 'Contents' in response:
                for obj in response['Contents']:
                    if obj['LastModified'].replace(tzinfo=None) < cutoff_time:
                        self.s3_client.delete_object(
                            Bucket=self.bucket_name,
                            Key=obj['Key']
                        )
                        deleted_count += 1
                        print(f"🗑️ Deleted old file: {obj['Key']}")
            
            return deleted_count
            
        except Exception as e:
            print(f"❌ Error during cleanup: {e}")
            return 0
    
    def upload_file_with_fallback(self, local_file_path: str, session_id: str, 
                                 file_type: str = "report") -> str:
        """
        Upload file with fallback to local path if S3 fails
        
        Args:
            local_file_path: Path to the local file
            session_id: Session identifier
            file_type: Type of file ("report", "plot", etc.)
            
        Returns:
            S3 URL if successful, local path if S3 fails, placeholder if all fails
        """
        if file_type == "report":
            s3_url = self.upload_pdf_report(local_file_path, session_id)
            if s3_url:
                return s3_url
            else:
                # Fallback to local path (for development)
                return f"/api/reports/session_{session_id}.pdf"
        
        elif file_type == "plot":
            s3_url = self.upload_plot_image(local_file_path, session_id)
            if s3_url:
                return s3_url
            else:
                # Fallback to local path
                return f"/api/plots/session_{session_id}_summary.png"
        
        # Ultimate fallback
        return f"s3://{self.bucket_name}/placeholder/session_{session_id}.{file_type}"
    
    def get_bucket_info(self) -> Dict[str, Any]:
        """
        Get information about the S3 bucket
        
        Returns:
            Dictionary with bucket information
        """
        info = {
            "bucket_name": self.bucket_name,
            "region": self.region,
            "available": self.is_available(),
            "total_objects": 0,
            "total_size_mb": 0
        }
        
        if not self.is_available():
            return info
        
        try:
            # Get bucket statistics
            response = self.s3_client.list_objects_v2(Bucket=self.bucket_name)
            
            if 'Contents' in response:
                info["total_objects"] = len(response['Contents'])
                total_size = sum(obj['Size'] for obj in response['Contents'])
                info["total_size_mb"] = round(total_size / (1024 * 1024), 2)
            
        except Exception as e:
            print(f"⚠️ Error getting bucket info: {e}")
        
        return info

# ============================================================================
# Factory function for easy instantiation
# ============================================================================

def create_s3_service(bucket_name: str = "gait-analysis-reports") -> S3Service:
    """
    Factory function to create S3 service instance
    
    Args:
        bucket_name: Name of the S3 bucket
        
    Returns:
        Configured S3Service instance
    """
    return S3Service(bucket_name=bucket_name)

# ============================================================================
# Configuration from environment variables
# ============================================================================

def create_s3_service_from_env() -> S3Service:
    """
    Create S3 service from environment variables
    
    Environment variables:
    - GAIT_REPORTS_BUCKET: S3 bucket name (default: gait-analysis-reports)
    - AWS_DEFAULT_REGION: AWS region (default: us-east-1)
    
    Returns:
        Configured S3Service instance
    """
    bucket_name = os.environ.get('GAIT_REPORTS_BUCKET', 'gait-analysis-reports')
    region = os.environ.get('AWS_DEFAULT_REGION', 'us-east-1')
    
    return S3Service(bucket_name=bucket_name, region=region)
# ============================================================================
# UPDATED app/processor/entry_point.py - With Patient Info
# ============================================================================

from datetime import datetime
from app.utils.dynamo import fetch_session_data
from app.utils.api_client import send_processed_results
from app.processor.gait_processor import GaitProcessor

def process_gait_data(message: dict):
    try:
        session_id = message["sessionId"]
        sensor_id = message["sensorId"]
        start_time = datetime.fromisoformat(message["startTime"])
        end_time = datetime.fromisoformat(message["endTime"])
        
        # Extract patient information from SQS message
        patient_info = message.get("patientInfo", {})
        
        print(f"⚙️ Processing session {session_id} for patient {patient_info.get('name', 'Unknown')}")
        print(f"📅 Session: {start_time} to {end_time} for sensor {sensor_id}")

        raw_data = fetch_session_data(sensor_id, start_time, end_time)
        print(f"📦 Retrieved {len(raw_data)} data points from DynamoDB")

        # Pass patient info to GaitProcessor
        processor = GaitProcessor()
        processed_result = processor.compute(session_id, raw_data, patient_info=patient_info)

        send_processed_results(processed_result)
        print(f"🚀 Results sent to backend for session {session_id}")
        print(f"✅ Finished processing session {session_id}")

    except KeyError as e:
        print(f"❌ Missing key in message: {e}")
    except ValueError as e:
        print(f"❌ Invalid datetime format: {e}")
    except Exception as e:
        print(f"❌ Unexpected error during processing: {e}")
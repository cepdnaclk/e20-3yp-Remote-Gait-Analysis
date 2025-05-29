from datetime import datetime
from dynamo import fetch_session_data
from api_client import send_processed_results

def process_gait_data(message: dict):
    """
    Process the gait data based on the message received from SQS.
    Example Message:
    {
        "sensorId": 601,
        "startTime": "2025-05-28T12:15:45.456",
        "endTime": "2025-05-28T12:16:11.157",
        "sessionId": 1
    }
    """
    try:
        session_id = message["sessionId"]
        sensor_id = message["sensorId"]
        start_time = datetime.fromisoformat(message["startTime"])
        end_time = datetime.fromisoformat(message["endTime"])

        print(f"⚙️ Processing session {session_id} from {start_time} to {end_time} for sensor {sensor_id}")

        # 1. Fetch data from DynamoDB
        raw_data = fetch_session_data(sensor_id, start_time, end_time)
        print(f"📦 Retrieved {len(raw_data)} data points from DynamoDB")

        # 2. Process raw data (placeholder)
         # 2. Dummy result matching Java DTO structure
        processed_result = {
            "status": True,
            "sessionId": session_id,
            "steps": 42,
            "cadence": 108.5,
            "avgHeelForce": 120.4,
            "avgToeForce": 234.2,
            "avgMidfootForce": 145.0,
            "balanceScore": 0.91,
            "peakImpact": 980,
            "durationSeconds": 11.7,
            "avgSwingTime": 0.45,
            "avgStanceTime": 0.67,
            "pressureResultsPath": "s3://dummy/path/pressure-map.png",
            "strideTimes": [1.01, 1.03, 1.02]
        }

        # 3. Send results to main backend
        send_processed_results(processed_result)
        print(f"🚀 Results sent to backend for session {session_id}")

        print(f"✅ Finished processing session {session_id}")

    except KeyError as e:
        print(f"❌ Missing key in message: {e}")
    except ValueError as e:
        print(f"❌ Invalid datetime format: {e}")
    except Exception as e:
        print(f"❌ Unexpected error during processing: {e}")

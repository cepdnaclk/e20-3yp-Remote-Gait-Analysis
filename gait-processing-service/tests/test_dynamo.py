import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from datetime import datetime
from app.utils.dynamo import fetch_session_data
from dotenv import load_dotenv

load_dotenv()

# Test input: Replace these with a known good session range from your DB
sensor_id = 601
# start_time = datetime.fromisoformat("2025-05-28T12:15:45.456")
# end_time = datetime.fromisoformat("2025-05-28T12:16:11.157")

start_time = datetime.fromtimestamp(1747892951)
end_time = datetime.fromtimestamp(1747892952)

data = fetch_session_data(sensor_id, start_time, end_time)

print(f"📊 Retrieved {len(data)} items from DynamoDB:")
for item in data[:5]:  # Limit output
    print(item)

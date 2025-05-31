import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

API_URL = os.getenv("BACKEND_RSULTS_API")

def send_processed_results(result_data):
    #url = f"{API_URL}/api/results"
    url = os.getenv("BACKEND_RESULTS_API")
    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(url, data=json.dumps(result_data), headers=headers)
        response.raise_for_status()
        print(f"✅ Sent results to backend: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to send results to backend: {e}")

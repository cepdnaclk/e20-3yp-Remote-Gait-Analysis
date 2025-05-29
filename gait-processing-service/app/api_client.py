# api_client.py
import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

BACKEND_API_URL = os.getenv("BACKEND_RESULTS_API")  # Update as needed

def send_processed_results(processed_result: dict) -> bool:
    """
    Sends the processed gait analysis result to the backend.
    """

    try:
        response = requests.post(BACKEND_API_URL, json=processed_result)
        if response.status_code == 200:
            print(f"✅ Successfully posted results for session {processed_result['sessionId']}")
            return True
        else:
            print(f"❌ Failed to post results. Status: {response.status_code}, Response: {response.text}")
            return False
    except requests.RequestException as e:
        print(f"❌ Exception during API call: {e}")
        return False

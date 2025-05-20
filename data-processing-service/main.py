from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import time

app = FastAPI()

# Define the request format expected from the main app
class ProcessingRequest(BaseModel):
    sensorId: int
    startTime: str
    endTime: str
    sessionId: int

@app.post("/process-session")
def process_session(data: ProcessingRequest):
    print(f"🔁 Received processing request for session {data.sessionId}")
    print(data)
    # Simulate processing delay
    time.sleep(10)

    # Generate dummy result
    result = {
        "sessionId": data.sessionId,
        "stepTime": 1.8,
        "stepLength": 45,
        "strideLength": 90,
        "strideTime": 2.2,
        "cadence": 110,
        "speed": 1.3,
        "symmetryIndex": 98.5,
        "pressureResultsPath": "https://example.com/fake-image.png"
    }

    try:
        # Send POST request to your Spring Boot API
        print(f"📤 Sending results to backend at session {data.sessionId}")
        response = requests.post("http://localhost:8080/api/results", json=result)
        response.raise_for_status()
        print("✅ Results successfully sent to backend.")
    except Exception as e:
        print(f"❌ Failed to send results to backend: {e}")
        raise HTTPException(status_code=500, detail="Failed to send results")

    return {"message": "Processing complete"}

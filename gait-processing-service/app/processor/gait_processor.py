class GaitProcessor:
    def compute(self, session_id, raw_data):
        print("🧠 Running dummy gait processing logic...")

        # Dummy logic (replace later)
        return {
            "status": True,
            "sessionId": session_id,
            "steps": 42,
            "cadence": 104.2,
            "avgHeelForce": 120.0,
            "avgToeForce": 240.0,
            "avgMidfootForce": 180.0,
            "balanceScore": 0.85,
            "peakImpact": 980,
            "durationSeconds": 12.5,
            "avgSwingTime": 0.45,
            "avgStanceTime": 0.65,
            "pressureResultsPath": "s3://bucket/heatmaps/session_1.png",
            "strideTimes": [1.02, 1.04, 1.01]
        }

import os
import json
import boto3
from dotenv import load_dotenv
from processor import process_gait_data

# Load environment variables from .env file
load_dotenv()

# AWS SQS client setup
sqs = boto3.client(
    "sqs",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)

QUEUE_URL = os.getenv("SQS_QUEUE_URL")

def poll_sqs():
    print("🎯 Polling for messages...")

    while True:
        try:
            response = sqs.receive_message(
                QueueUrl=QUEUE_URL,
                MaxNumberOfMessages=1,
                WaitTimeSeconds=10  # Long polling
            )

            messages = response.get("Messages", [])
            if not messages:
                continue

            for msg in messages:
                try:
                    body = json.loads(msg["Body"])
                    print("🔔 Received message:")
                    print(json.dumps(body, indent=2))

                    process_gait_data(body)

                    # Delete message only after successful processing
                    sqs.delete_message(
                        QueueUrl=QUEUE_URL,
                        ReceiptHandle=msg["ReceiptHandle"]
                    )
                    print("✅ Message processed and deleted.")

                except Exception as e:
                    print("❌ Error processing message:", str(e))

        except Exception as e:
            print("❌ Failed to poll SQS:", str(e))


if __name__ == "__main__":
    poll_sqs()

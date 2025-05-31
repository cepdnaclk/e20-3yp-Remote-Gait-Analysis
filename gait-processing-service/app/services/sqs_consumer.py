import os
import json
import boto3
from dotenv import load_dotenv
from app.processor.entry_point import process_gait_data

load_dotenv()

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
        response = sqs.receive_message(
            QueueUrl=QUEUE_URL,
            MaxNumberOfMessages=1,
            WaitTimeSeconds=10
        )

        messages = response.get("Messages", [])

        if not messages:
            continue

        for msg in messages:
            try:
                body = json.loads(msg["Body"])
                process_gait_data(body)

                sqs.delete_message(
                    QueueUrl=QUEUE_URL,
                    ReceiptHandle=msg["ReceiptHandle"]
                )
                print("✅ Message processed and deleted.")

            except Exception as e:
                print("❌ Error processing message:", str(e))

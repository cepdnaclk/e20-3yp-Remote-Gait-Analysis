# dynamo.py
import os
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# Setup DynamoDB
dynamodb = boto3.resource(
    'dynamodb',
    region_name=os.getenv("AWS_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

table = dynamodb.Table(os.getenv("DYNAMODB_TABLE", "RawSensorData"))

def fetch_session_data(sensor_id: int, start_time: datetime, end_time: datetime):
    """
    Fetch raw sensor data from DynamoDB for the given sensor ID and time range.
    Returns a list of 'payload' dicts sorted by timestamp.
    """
    start_epoch = int(start_time.timestamp())
    end_epoch = int(end_time.timestamp())

    try:
        response = table.query(
                KeyConditionExpression=Key("device_id").eq(str(sensor_id)) &
                                    Key("timestamp").between(Decimal(start_epoch), Decimal(end_epoch)),
                ProjectionExpression="#ts, payload",
                ExpressionAttributeNames={"#ts": "timestamp"}
            )

        items = response.get("Items", [])
        sorted_payloads = sorted([item["payload"] for item in items], key=lambda p: p["timestamp"])
        return sorted_payloads

    except Exception as e:
        print(f"❌ Error fetching from DynamoDB: {e}")
        return []

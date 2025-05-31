# # dynamo.py
# import os
# import boto3
# from boto3.dynamodb.conditions import Key
# from decimal import Decimal
# from datetime import datetime
# from dotenv import load_dotenv

# load_dotenv()

# # Setup DynamoDB
# dynamodb = boto3.resource(
#     'dynamodb',
#     region_name=os.getenv("AWS_REGION"),
#     aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
#     aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
# )

# table = dynamodb.Table(os.getenv("DYNAMODB_TABLE", "RawSensorData"))

# def fetch_session_data(sensor_id: int, start_time: datetime, end_time: datetime):
#     """
#     Fetch raw sensor data from DynamoDB for the given sensor ID and time range.
#     Returns a list of 'payload' dicts sorted by timestamp.
#     """
#     start_epoch = int(start_time.timestamp())
#     end_epoch = int(end_time.timestamp())

#     try:
#         response = table.query(
#                 KeyConditionExpression=Key("device_id").eq(str(sensor_id)) &
#                                     Key("timestamp").between(Decimal(start_epoch), Decimal(end_epoch)),
#                 ProjectionExpression="#ts, payload",
#                 ExpressionAttributeNames={"#ts": "timestamp"}
#             )

#         items = response.get("Items", [])
#         sorted_payloads = sorted([item["payload"] for item in items], key=lambda p: p["timestamp"])
#         return sorted_payloads

#     except Exception as e:
#         print(f"❌ Error fetching from DynamoDB: {e}")
#         return []


import os
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal
from dotenv import load_dotenv

load_dotenv()

dynamodb = boto3.resource(
    'dynamodb',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)

table = dynamodb.Table(os.getenv("DYNAMODB_TABLE"))

def fetch_session_data(sensor_id: int, start_time, end_time):
    """
    Fetch sensor data from DynamoDB using millisecond timestamps.
    Includes debug print statements.
    """
    # Convert datetime to epoch milliseconds
    start_epoch_ms = int(start_time.timestamp() * 1000)
    end_epoch_ms = int(end_time.timestamp() * 1000)

    print(f"\n🔍 [DEBUG] Fetching data for Sensor ID: {sensor_id}")
    print(f"🕒 [DEBUG] Start Time: {start_time} -> {start_epoch_ms}")
    print(f"🕒 [DEBUG] End Time:   {end_time} -> {end_epoch_ms}")

    try:
        response = table.query(
            KeyConditionExpression=Key("device_id").eq(str(sensor_id)) &
                                   Key("timestamp").between(Decimal(start_epoch_ms), Decimal(end_epoch_ms)),
            ProjectionExpression="#ts, payload",
            ExpressionAttributeNames={"#ts": "timestamp"}
        )
        items = response.get("Items", [])
        print(f"📦 [DEBUG] Retrieved {len(items)} items from DynamoDB.\n")
        return [item["payload"] for item in items]
    except Exception as e:
        print(f"❌ [ERROR] Exception during DynamoDB query: {e}\n")
        return []


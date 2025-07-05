# Use a minimal Python image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app source code
COPY app/ app/

# Set the Python path to make 'app' importable
ENV PYTHONPATH=/app

# Entrypoint
CMD ["python", "app/main.py"]

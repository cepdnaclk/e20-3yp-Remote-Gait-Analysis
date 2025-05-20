# Guide to create the virtual environment

## Create a virtual environment (named .venv)
python -m venv .venv

## Activate the virtual environment
.venv\Scripts\activate

## Install dependencies
pip install fastapi uvicorn[standard] requests

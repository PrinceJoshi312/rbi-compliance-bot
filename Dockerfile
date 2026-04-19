# Dockerfile for RBI Compliance Chatbot on Fly.io
FROM python:3.12.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies (optional: for PyPDF2, FAISS, etc.)
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Set PYTHONPATH to include the backend directory for imports
ENV PYTHONPATH=/app/backend

# Streamlit runs on port 8080 in Fly.io
ENV PORT=8080
EXPOSE 8080

# Start Streamlit app
CMD ["streamlit", "run", "rbi-compliance-bot-master/app_streamlit.py", "--server.port=8080", "--server.enableCORS=false"]

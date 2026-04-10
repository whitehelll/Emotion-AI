FROM python:3.10

WORKDIR /app

COPY . .

# Install system dependencies for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0

# Upgrade pip
RUN pip install --upgrade pip

# Install TensorFlow first (heavy)
RUN pip install --no-cache-dir --default-timeout=1000 tensorflow-cpu==2.12.0

# Install rest
RUN pip install --no-cache-dir --default-timeout=1000 -r requirements.txt

EXPOSE 10000

CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:10000"]
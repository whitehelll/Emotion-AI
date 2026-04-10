# Use stable Python version (important for TensorFlow)
FROM python:3.10

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port (Render uses 10000)
EXPOSE 10000

# Start app with gunicorn
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:10000"]
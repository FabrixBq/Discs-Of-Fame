FROM python:3.12

# Instala Git y PostgreSQL client
RUN apt-get update && apt-get install -y git postgresql-client vim curl && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

# Instalar dependencias si existe requirements.txt
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt || echo "No requirements.txt found"


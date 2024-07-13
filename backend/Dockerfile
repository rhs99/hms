FROM python:3.10.12
WORKDIR /code
RUN pip install pip-tools==7.4.1
COPY requirements.txt .
RUN pip-sync 
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
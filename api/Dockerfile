
FROM python:3.9

RUN apt-get update && apt-get install -y postgresql-client

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY init.sh .
RUN chmod +x init.sh

EXPOSE 8000

ENTRYPOINT ["./init.sh"]

CMD ["sh", "-c", "python manage.py runserver 0.0.0.0:8000"]

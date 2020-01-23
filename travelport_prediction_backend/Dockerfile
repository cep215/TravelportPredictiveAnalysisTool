FROM ubuntu:16.04

MAINTAINER Catalina Popescu

RUN apt-get update -y && apt-get install -y python3-pip python3-tk

COPY . /app

WORKDIR /app

EXPOSE 5000

RUN pip3 install --upgrade pip

RUN pip3 install --timeout 1000 -r requirements.txt

ENTRYPOINT [ "python3" ]

CMD [ "app.py" ]

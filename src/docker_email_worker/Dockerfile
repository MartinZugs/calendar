FROM ubuntu:18.04

LABEL Maintainer="Martin Zugschwert"

COPY src/ .
RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip3 install -r requirements.txt

CMD ["python3", "/send_email.py"]
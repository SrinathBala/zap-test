#!/bin/bash
sudo yum install python3-pip git docker -y
sudo git clone "https://github.com/SrinathBala/docker-flask.git"
cd /docker-test
sudo docker build -t my-image .
sudo docker run -p 80:80 my-image

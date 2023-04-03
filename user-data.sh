#!/bin/bash
sudo yum update -y
sudo yum install python3-pip git mysql -y
sudo git clone "https://github.com/SrinathBala/flask.git"
sudo pip3 install flask
cd /flask
sudo python3 app.py
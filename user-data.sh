#!/bin/bash
sudo yum install python3-pip git -y
sudo git clone "https://github.com/SrinathBala/helloworld.git"
sudo pip3 install flask
cd /flask
python3 app.py
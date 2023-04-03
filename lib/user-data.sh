      #!/bin/bash
      sudo -i
      yum update -y
      nyum install python3-pip git -y
      git clone ${githubUrl}
      pip3 install flask
      cd zap-flask
      python3 app.py

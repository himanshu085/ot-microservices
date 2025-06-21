#!/bin/bash

# Set the DEBIAN_FRONTEND environment variable to noninteractive
export DEBIAN_FRONTEND=noninteractive

# Update package lists
sudo apt update -y

# Configure needrestart to always automatically restart services
sudo sed -i "/#\$nrconf{restart} = 'i';/s/.*/\$nrconf{restart} = 'a';/" /etc/needrestart/needrestart.conf

# Continue with the rest of the script...

# Download and install Apache Maven
wget https://dlcdn.apache.org/maven/maven-3/3.9.4/binaries/apache-maven-3.9.4-bin.tar.gz
tar -xvzf apache-maven-3.9.4-bin.tar.gz
sudo mv apache-maven-3.9.4 /opt/
echo 'M2_HOME="/opt/apache-maven-3.9.4"' >> ~/.profile
echo 'PATH="$M2_HOME/bin:$PATH"' >> ~/.profile
echo 'export PATH' >> ~/.profile
source ~/.profile

# Install Golang Migrate
wget https://github.com/golang-migrate/migrate/releases/download/v4.16.2/migrate.linux-amd64.tar.gz
tar -xvzf migrate.linux-amd64.tar.gz
sudo mv migrate /usr/bin/

# Clone the Git repository
git clone https://github.com/OT-MICROSERVICES/salary-api.git

# Create migration.json file
echo '{
  "database": "cassandra://172.17.0.3:9042/employee_db?username=scylladb&password=password"
}' > /home/ubuntu/salary-api/migration.json

# Create application.yml file
echo 'spring:
  cassandra:
    keyspace-name: employee_db
    contact-points: 172.17.0.3
    port: 9042
    username: scylladb
    password: password
    local-datacenter: datacenter1
  data:
    redis:
      host: 172.17.0.4
      port: 6379
      password: password

management:
  endpoints:
    web:
      base-path: /actuator
      exposure:
        include: [ "health", "prometheus", "metrics" ]
  health:
    cassandra:
      enabled: true
  endpoint:
    health:
      show-details: always
    metrics:
      enabled: true
    prometheus:
      enabled: true

logging:
  level:
    org.springframework.web: DEBUG

springdoc:
  swagger-ui:
    path: /salary-documentation
    tryItOutEnabled: true
    filter: true
  api-docs:
    path: /salary-api-docs
  show-actuator: true' | sudo tee /home/ubuntu/salary-api/src/main/resources/application.yml

# Build the project
cd /home/ubuntu/salary-api
mvn clean package -DskipTests

# Create the start.sh script
echo '#!/bin/bash

java -jar target/salary-0.1.0-RELEASE.jar' | tee /home/ubuntu/salary-api/start.sh

# Create the systemd service file
echo "[Unit]
Description=Salary API Service
After=network.target

[Service]
ExecStart=/home/ubuntu/salary-api/start.sh
WorkingDirectory=/home/ubuntu/salary-api
User=ubuntu
Restart=always

[Install]
WantedBy=multi-user.target" | sudo tee /etc/systemd/system/salary-api.service

# Reload systemd and start the service
sudo systemctl daemon-reload
sudo systemctl start salary-api
sudo systemctl enable salary-api
sudo systemctl status salary-api
sudo systemctl restart salary-api

# Update package list
sudo apt update

# Install figlet and lolcat
sudo apt install -y figlet lolcat

# Add the figlet and lolcat command to .bashrc
echo 'figlet -f slant -c "SALARY OT-MICROSERVICES" | lolcat' >> ~/.bashrc

# Reload .bashrc to apply changes
source ~/.bashrc

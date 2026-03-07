#!/bin/bash

echo "============================================="
echo "   Setting up VolunteerHub Environment      "
echo "============================================="

# 1. Update package lists
echo "--> Updating apt package list..."
sudo apt update

# 2. Install OpenJDK 21
echo "--> Installing OpenJDK 21..."
sudo apt install -y openjdk-21-jdk

# Ensure Java 21 is set as default (if multiple versions are installed)
echo "--> Setting Java 21 as the default version..."
sudo update-alternatives --set java /usr/lib/jvm/java-21-openjdk-amd64/bin/java
sudo update-alternatives --set javac /usr/lib/jvm/java-21-openjdk-amd64/bin/javac

# 3. Install MySQL Server
echo "--> Installing MySQL Server..."
sudo apt install -y mysql-server

# 4. Configure MySQL Database and User
echo "--> Configuring MySQL Database (volunteer_db) and root user..."
# Using sudo to execute mysql commands (works with default auth_socket for root in Ubuntu)
sudo mysql -e "CREATE DATABASE IF NOT EXISTS volunteer_db;"
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'hoanglmv';"
sudo mysql -e "FLUSH PRIVILEGES;"

echo "============================================="
echo "   Setup Complete!                           "
echo "============================================="
echo "Verify versions:"
java -version
mysql --version

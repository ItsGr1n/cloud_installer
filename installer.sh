#!/bin/bash

currentDir=$(pwd)
defaultPath="/home/$USER/Documents"

echo "Enter installation path (or press Enter for default: $defaultPath): "
read installPath

if [ -z "$installPath" ]; then
    installPath="$defaultPath"
fi

interfacePath="$currentDir/interface"

# Install Nginx
echo "Installing the latest version of Nginx..."
sudo apt update && sudo apt install -y nginx

# Install OpenSSH server
echo "Installing OpenSSH server..."
sudo apt install -y openssh-server

# Ensure SSH service is running
echo "Starting SSH service..."
sudo systemctl enable ssh
sudo systemctl start ssh

# Copy interface files to installation path
echo "Copying interface files to $installPath..."
cp -r "$interfacePath" "$installPath"

# Create empty storage folder
echo "Creating empty 'storage' folder in $installPath..."
mkdir -p "$installPath/storage"

# Configure Nginx to serve the site
echo "Configuring Nginx to serve the site..."
echo "server { listen 80; root $installPath/interface; index index.html; }" | sudo tee /etc/nginx/sites-available/custom_site
sudo ln -s /etc/nginx/sites-available/custom_site /etc/nginx/sites-enabled/
sudo systemctl restart nginx

# Install Node.js and npm
echo "Installing the latest version of Node.js and npm..."
sudo apt install -y nodejs npm

# Install ssh2 for Node.js
echo "Installing ssh2 library for Node.js..."
npm install ssh2

# Verify installations
echo "Verifying installed versions:"
node -v
npm -v
npm list ssh2

# Display IP address for SSH connection
echo "Fetching IP address for SSH connection..."
ip_address=$(ip addr show | grep -E 'inet [0-9]' | grep -v '127.0.0.1' | awk '{print $2}' | cut -d'/' -f1 | head -n 1)
echo "SSH server is running. You can connect using: ssh $USER@$ip_address"

echo "Installation and configuration completed!"
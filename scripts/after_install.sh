#!/bin/bash
set -e

echo "After install script running..."

cd /home/ec2-user/LMS-BE

echo "Fixing ownership..."
sudo chown -R ec2-user:ec2-user /home/ec2-user/LMS-BE

# Install Node.js if not already installed
if ! command -v node &>/dev/null; then
  echo "Installing Node.js..."
  curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
  sudo yum install -y nodejs
fi

# Install PM2 globally
sudo npm install -g pm2

# Install app dependencies
npm install --omit=dev
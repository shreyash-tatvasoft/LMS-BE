#!/bin/bash
set -e

echo "🔹 Installing MariaDB (MySQL) client..."
sudo yum install -y mariadb

DB_HOST=$(aws ssm get-parameter --name "/myapp/DB_HOST" --with-decryption --query "Parameter.Value" --output text --region ap-south-1)
DB_USER=$(aws ssm get-parameter --name "/myapp/DB_USER" --with-decryption --query "Parameter.Value" --output text --region ap-south-1)
DB_PASS=$(aws ssm get-parameter --name "/myapp/DB_PASS" --with-decryption --query "Parameter.Value" --output text --region ap-south-1)
DB_NAME=$(aws ssm get-parameter --name "/myapp/DB_NAME" --with-decryption --query "Parameter.Value" --output text --region ap-south-1)

echo "🔹 Running migrations on DB $DB_NAME at $DB_HOST..."
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME < /home/ec2-user/LMS-BE/migrations/schema.sql
echo "Database migration complete!"

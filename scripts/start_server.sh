echo "Start Server"
cd /home/ec2-user/LMS-BE
echo "Fixing ownership..."
sudo chown -R ec2-user:ec2-user /home/ec2-user/LMS-BE
pm2 stop all || true
pm2 start dist/index.js
########################################################################################################################
# INSTALL TransIP BladeVPS ubuntu 20.04 - cvtool.valori.nl
#
# Prerequisites: make sure that the following files are in your homedir (~rbosman):
#   ~bosmanr/.env
#   ~bosmanr/docker-compose.yml
#   ~bosmanr/cvtool_backup_mongodb.sh
#   ~bosmanr/cvtool_renew_certificate.sh
########################################################################################################################

sudo -i

apt-get -y update
apt-get -y upgrade

apt-get -y install fail2ban

# Configure firewall.
# Whitelist IP-numbers for SSH:
#   85.146.18.88/32 (Rob thuis)
#   157.97.115.136/29 (Valori kantoor)
#   145.131.215.232/29 (Skyliner kantoor, daar zit Luke vaak)
#   2a02:22a0:bbb6:1602::/64 (Skyliner kantoor IPv6)
apt-get -y install ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow from 85.146.18.88/32 to any port 22
ufw allow from 157.97.115.136/29 to any port 22
ufw allow from 145.131.215.232/29 to any port 22
ufw allow from 2a02:22a0:bbb6:1602::/64 to any port 22
ufw allow 443/tcp
ufw allow 80/tcp
ufw allow from 85.146.18.88 to any port 27017
ufw enable

# Install Docker.
apt-get -y install docker.io
systemctl enable --now docker
usermod -aG docker rbosman

# Install docker-compose.
curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Login to DockerHub.
docker login -u bransom
# NOTE: remove pwd from /root/.docker/config.json

# Prepare secret config file.
mkdir -p /secret
cp ~bosmanr/.env /secret
chmod -R 400 /secret

# Copy script files to /root/.
cp ~bosmanr/docker-compose.yml .
cp ~bosmanr/cvtool_backup.sh .
cp ~bosmanr/cvtool_renew_certificate.sh .

########################################################################################################################
# Add crontab rules, see file crontab.example.
crontab -e
########################################################################################################################

# Install MongoDB and CVtool and run letsencrypt to obtain SSL certs. (Restart CVtool server to load a new certificate.)
docker pull bransom/cvtool
docker-compose -f docker-compose.yaml --env-file=/secret/.env up -d
docker container prune -f
docker image prune -f

# Restart CVtool server to load a new certificate.
docker container restart "$(docker ps -aqf 'name=cvtool')"

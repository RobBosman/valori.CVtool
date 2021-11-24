########################################################################################################################
# INSTALL TransIP BladeVPS ubuntu 20.04 - cvtool.valori.nl
#
# Prerequisites: make sure that the following files are in your homedir (~rbosman):
#   ~bosmanr/docker-compose.yml
#   ~bosmanr/scripts/.env.example
#   ~bosmanr/scripts/crontab.example
#   ~bosmanr/scripts/cvtool_*.sh
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

# Install haveged to provide entropy for secure random number generation.
apt-get -y install haveged
systemctl start haveged.service
systemctl enable --now haveged

# Install Docker.
apt-get -y install docker.io
systemctl enable --now docker
usermod -aG docker rbosman

# Install docker-compose.
curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Copy script files to /root/.
cp ~bosmanr/docker-compose.yml .
cp ~bosmanr/scripts/cvtool_*.sh .

# Prepare secret config file.
mkdir -p /secret
cp ~bosmanr/scripts/.env.example /secret/.env
chmod -R 400 /secret
# Fill-in secret data.
vi /secret/.env

# Login to DockerHub.
docker login -u bransom
# NOTE: remove pwd from /root/.docker/config.json

########################################################################################################################
# Add crontab rules, see file ~bosmanr/scripts/crontab.example.
crontab -e
########################################################################################################################

# Install MongoDB and CVtool and run letsencrypt to obtain SSL certs. (Restart CVtool server to load a new certificate.)
docker pull bransom/cvtool-backend
docker pull bransom/cvtool-frontend
docker-compose -f docker-compose.yaml --env-file=/secret/.env up -d
docker container prune -f
docker image prune -f

# Restore MongoDB.
# ./cvtool_restore_data.sh
# ./cvtool_restore_mongodb.sh

# Initialize MongoDB.
./cvtool_initialize_mongodb.sh

# Restart CVtool server to load a new certificate.
docker container restart "$(docker ps -aqf 'ancestor=bransom/cvtool')"
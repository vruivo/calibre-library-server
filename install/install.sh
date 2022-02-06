#!/bin/bash

# check for root permissions
if [ "$EUID" -ne 0 ]; then
  echo -e "This script needs root permissions!\nTry using sudo"
  exit 1
fi

if [ ! -e /usr/bin/node ]; then
  echo "Creating symlink for/usr/bin/node"
  sudo ln -s $(which node) /usr/bin/node
fi

if [ ! -e /usr/bin/npm ]; then
  echo "Creating symlink for /usr/bin/npm"
  sudo ln -s $(which npm) /usr/bin/npm
fi


SERVICE_NAME="calibre-library-server.service"
export DIR=$(dirname $(pwd))

echo "# Configuring service /etc/systemd/system/${SERVICE_NAME}"
cat service.template | envsubst | tee /etc/systemd/system/${SERVICE_NAME}

echo
echo "# Registering service"
systemctl daemon-reload

echo "# Enable service on boot & start it now"
systemctl start ${SERVICE_NAME}
systemctl enable ${SERVICE_NAME}

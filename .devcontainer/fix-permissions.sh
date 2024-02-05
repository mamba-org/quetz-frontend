#!/bin/bash

# Check if the user can execute commands with sudo
if sudo -l &>/dev/null; then
    echo "User has sudo privileges. Proceeding with file and directory checks."

    # Get the current user's UID and GID
    USER_UID=$(id -u)
    USER_GID=$(id -g)

    sudo chown -R $USER_UID:$USER_GID /data
    sudo chown -R $USER_UID:$USER_GID $MAMBA_ROOT_PREFIX

else
    echo "User does not have sudo privileges. Exiting script."
fi

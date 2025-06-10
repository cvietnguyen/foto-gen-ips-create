#!/bin/bash

# Override the default Nginx configuration
cat <<EOT > /etc/nginx/conf.d/default.conf
server {
    listen 8080;
    server_name localhost;
    root /home/site/wwwroot;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOT

# Start Nginx
exec nginx -g 'daemon off;'
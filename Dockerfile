FROM nginx:alpine

# Install bash for the script to function
RUN apk update && apk add --no-cache bash

# Copy nginx configuration cronfile, tls, script and static assets
COPY ./conf/nginx.conf /etc/nginx/nginx.conf
COPY ./conf/default.conf /etc/nginx/conf.d/default.conf
COPY /keys/certificate.key /etc/nginx/tls/certificate.key
COPY /keys/certificate.crt /etc/nginx/tls/certificate.crt
COPY ./cronfile /etc/cron.d/cronfile
COPY ./script.sh /script.sh
COPY ./src/html/app.js /usr/share/nginx/html/app.js
COPY ./src/html/style.css /usr/share/nginx/html/style.css

# Set up the cron job and start cron daemon
RUN cat /etc/cron.d/cronfile >> /var/spool/cron/crontabs/root && crond
RUN /bin/bash /script.sh

# Expose HTTP and HTTPS
EXPOSE 80 443

# Run nginx and cron in the foreground
CMD ["sh", "-c", "nginx -g 'daemon off;'"]

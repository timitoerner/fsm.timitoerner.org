FROM nginx:alpine

# Install bash for the script to function
RUN apk update && apk add --no-cache bash grep pcre;

# Copy nginx configuration cronfile, script and static assets
COPY ./conf/nginx.conf /etc/nginx/nginx.conf
COPY ./conf/default.conf /etc/nginx/conf.d/default.conf
COPY ./cronfile /etc/cron.d/cronfile
COPY ./script.sh /script.sh
#COPY ./src/html/app.js /usr/share/nginx/html/app.js
#COPY ./src/html/style.css /usr/share/nginx/html/style.css
COPY ./src/html/* /usr/share/nginx/html/

# Set up the cron job and start cron daemon
RUN cat /etc/cron.d/cronfile >> /var/spool/cron/crontabs/root;
RUN crond;
RUN /bin/bash /script.sh;

# Expose HTTP and HTTPS
EXPOSE 80 443

# Run nginx and cron in the foreground
CMD ["sh", "-c", "crond && nginx -g 'daemon off;'" ]

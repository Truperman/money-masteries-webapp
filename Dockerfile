FROM nginx:1.28-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY sw.js /usr/share/nginx/html/sw.js
COPY index.html /usr/share/nginx/html/index.html
COPY shopify-privacy.html /usr/share/nginx/html/shopify-privacy.html
COPY compensation.html /usr/share/nginx/html/compensation.html
COPY surplus-course.html /usr/share/nginx/html/surplus-course.html
COPY assets /usr/share/nginx/html/assets
COPY downloads /usr/share/nginx/html/downloads
EXPOSE 8080

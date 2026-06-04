FROM nginx:alpine
ENV PORT=8080
# Remove default config (we supply our own on the correct PORT)
RUN rm /etc/nginx/conf.d/default.conf

# Copy app files
COPY . /usr/share/nginx/html

# nginx:alpine processes /etc/nginx/templates/*.template with envsubst at startup,
# outputting to /etc/nginx/conf.d/ — this is how we inject $PORT at runtime.
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Kong Gateway with jwt-oidc plugin
# This custom image extends the official Kong image and adds the jwt-oidc plugin

FROM kong:3.8

# Switch to root to install plugins
USER root

# Install dependencies
RUN apt-get update && apt-get install -y git unzip curl && rm -rf /var/lib/apt/lists/*

# Install lua-resty-openidc dependency manually
RUN git clone --depth 1 --branch v1.7.6 https://github.com/zmartzone/lua-resty-openidc.git /tmp/lua-resty-openidc && \
    cd /tmp/lua-resty-openidc && \
    cp -r lib/resty/* /usr/local/share/lua/5.1/resty/ && \
    rm -rf /tmp/lua-resty-openidc

# Install kong-oidc-v3 plugin manually
RUN git clone --depth 1 https://github.com/Gate1106/kong-oidc-v3.git /tmp/kong-oidc-v3 && \
    mkdir -p /usr/local/share/lua/5.1/kong/plugins/oidc && \
    cp -r /tmp/kong-oidc-v3/kong/plugins/oidc/* /usr/local/share/lua/5.1/kong/plugins/oidc/ && \
    rm -rf /tmp/kong-oidc-v3

# Enable the oidc plugin
ENV KONG_PLUGINS=bundled,oidc

# Switch back to kong user for security
USER kong

# Expose Kong ports
# 8000: Proxy (HTTP)
# 8443: Proxy (HTTPS)
# 8001: Admin API (HTTP)
# 8444: Admin API (HTTPS)
EXPOSE 8000 8443 8001 8444

# Use Kong's default entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["kong", "docker-start"]

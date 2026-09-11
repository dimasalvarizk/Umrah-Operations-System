# ==========================================
# 1. Build Stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files from umrah-frontend
COPY umrah-frontend/package*.json ./

RUN npm install

# Copy source code
COPY umrah-frontend/ ./

# Build bundle
RUN npm run build

# ==========================================
# 2. Production Stage (Nginx)
# ==========================================
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html
COPY umrah-frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

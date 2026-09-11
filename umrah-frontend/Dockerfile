# ==========================================
# 1. Build Stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definition files
COPY package*.json ./

# Install dependencies (using npm ci for reproducible clean builds)
RUN npm install

# Copy application source code
COPY . .

# Build the production Vite bundle
RUN npm run build

# ==========================================
# 2. Production Runtime Stage (Nginx)
# ==========================================
FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built application assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration with SPA routing support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

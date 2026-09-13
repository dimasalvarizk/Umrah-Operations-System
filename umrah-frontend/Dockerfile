# ==========================================
# 1. Build Stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Ensure devDependencies (Vite, TypeScript, etc.) are installed even if NODE_ENV=production is passed by Coolify
ENV NODE_ENV=development

# Copy dependency definition files
COPY package*.json ./

# Install all dependencies required for building the Vite bundle
RUN npm install --include=dev

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

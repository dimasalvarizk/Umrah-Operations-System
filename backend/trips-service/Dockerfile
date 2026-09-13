FROM node:20-alpine

WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Expose Trips Service port
EXPOSE 5004

ENV NODE_ENV=production
ENV PORT=5004

CMD ["node", "server.js"]

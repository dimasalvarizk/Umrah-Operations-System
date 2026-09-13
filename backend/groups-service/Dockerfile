FROM node:20-alpine

WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Expose Groups Service port
EXPOSE 5003

ENV NODE_ENV=production
ENV PORT=5003

CMD ["node", "server.js"]

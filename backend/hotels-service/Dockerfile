FROM node:20-alpine

WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Expose Hotels Service port
EXPOSE 5005

ENV NODE_ENV=production
ENV PORT=5005

CMD ["node", "server.js"]

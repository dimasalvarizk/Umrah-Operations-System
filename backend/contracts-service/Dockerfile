FROM node:20-alpine

WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Expose Contracts Service port
EXPOSE 5007

ENV NODE_ENV=production
ENV PORT=5007

CMD ["node", "server.js"]

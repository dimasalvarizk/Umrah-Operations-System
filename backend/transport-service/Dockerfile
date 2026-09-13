FROM node:20-alpine

WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Expose Transport Service port
EXPOSE 5006

ENV NODE_ENV=production
ENV PORT=5006

CMD ["node", "server.js"]

FROM node:20-alpine

WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Expose Settings Service port
EXPOSE 5002

ENV NODE_ENV=production
ENV PORT=5002

CMD ["node", "server.js"]

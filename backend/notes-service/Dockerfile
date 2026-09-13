FROM node:20-alpine

WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Expose Notes Service port
EXPOSE 5008

ENV NODE_ENV=production
ENV PORT=5008

CMD ["node", "server.js"]

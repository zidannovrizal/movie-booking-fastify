FROM node:18-alpine

WORKDIR /app

# Install OpenSSL and other dependencies
RUN apk add --no-cache openssl openssl-dev libc6-compat

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig*.json ./
COPY src ./src/

RUN npm install
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

# Create start script
RUN echo '#!/bin/sh\nnpx prisma migrate deploy\nnpm start' > start.sh
RUN chmod +x start.sh

CMD ["./start.sh"] 
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
RUN npx prisma migrate deploy
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"] 
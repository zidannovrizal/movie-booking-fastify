FROM node:18-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache openssl openssl-dev libc6-compat

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig*.json ./
COPY src ./src/

RUN npm install
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

# Simple start command since tables are already created
CMD ["npm", "start"] 
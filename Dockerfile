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

# Create a simple entrypoint script
RUN echo '#!/bin/sh\n\
echo "Waiting for database to be ready..."\n\
sleep 5\n\
\n\
echo "Running database migrations..."\n\
npx prisma migrate deploy\n\
\n\
echo "Starting the application..."\n\
npm start' > /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

CMD ["/app/entrypoint.sh"] 
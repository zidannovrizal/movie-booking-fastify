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

# Create start script with retry logic
RUN echo '#!/bin/sh\n\
MAX_RETRIES=5\n\
RETRY_COUNT=0\n\
\n\
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do\n\
    echo "Attempting database migration (attempt $(($RETRY_COUNT + 1))/$MAX_RETRIES)..."\n\
    if npx prisma migrate deploy; then\n\
        echo "Migration successful!"\n\
        break\n\
    fi\n\
    RETRY_COUNT=$(($RETRY_COUNT + 1))\n\
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then\n\
        echo "Migration failed after $MAX_RETRIES attempts"\n\
        exit 1\n\
    fi\n\
    echo "Migration failed, retrying in 5 seconds..."\n\
    sleep 5\n\
done\n\
\n\
npm start' > start.sh

RUN chmod +x start.sh

CMD ["./start.sh"] 
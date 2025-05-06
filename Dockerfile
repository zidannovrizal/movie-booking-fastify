FROM node:18-alpine

WORKDIR /app

# Install PostgreSQL client and other dependencies
RUN apk add --no-cache openssl openssl-dev libc6-compat postgresql-client

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig*.json ./
COPY src ./src/
COPY init.sql ./

RUN npm install
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

# Create a more robust entrypoint script
RUN echo '#!/bin/sh\n\
echo "Waiting for database to be ready..."\n\
sleep 10\n\
\n\
echo "Creating database tables..."\n\
PGPASSWORD=${DATABASE_PASSWORD} psql -h ${DATABASE_HOST} -U ${DATABASE_USER} -d ${DATABASE_NAME} -f /app/init.sql || exit 1\n\
\n\
echo "Starting the application..."\n\
npm start' > /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

CMD ["/app/entrypoint.sh"] 
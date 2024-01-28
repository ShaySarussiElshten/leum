# Stage 1: Build the TypeScript application
FROM node:16-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Setup the production environment
FROM node:16-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the compiled JavaScript from the builder stage
COPY --from=builder /app/build ./build

# Copy .env file
COPY .env ./

# Expose the port the app runs on
EXPOSE 4000

# Add a user and run the app as this user for security reasons
RUN adduser -D appuser

# Download the wait-for script to the /app directory and give it the necessary permissions
ADD https://raw.githubusercontent.com/eficode/wait-for/v2.2.3/wait-for /app/wait-for
RUN chmod +x /app/wait-for && chown appuser:appuser /app/wait-for

# Change to the non-root user
USER appuser

# Use wait-for script to wait for Elasticsearch to be ready
CMD ["/app/wait-for", "elasticsearch:9200", "--timeout=30", "--", "node", "build/src/app.js"]

FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the built app
FROM node:18-alpine

WORKDIR /app

# Install a static file server
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

# Use Cloud Run's dynamic PORT
ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "serve -s dist -l $PORT"]


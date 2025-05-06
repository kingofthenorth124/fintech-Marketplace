# Build stage for React frontend
FROM node:18-alpine as frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Build stage for backend
FROM node:18-alpine as backend-build

WORKDIR /app
COPY package*.json ./
RUN npm install --production

# Final stage
FROM node:18-alpine

WORKDIR /app

# Copy backend files
COPY --from=backend-build /app/node_modules ./node_modules
COPY backend ./backend
COPY package*.json ./

# Copy frontend build
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 
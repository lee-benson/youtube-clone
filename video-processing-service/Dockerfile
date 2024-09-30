# Stage 1: Build Stage
FROM node:18 AS builder

# Set working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into workdir
COPY package*.json ./

# Install any needed packages
RUN npm install

# Copy code into docker image
COPY . .

# Build the app
RUN npm run build

# Stage 2: Production stage
FROM node:18

# Install ffmpeg in the container
RUN apt-get update && apt-get install -y ffmpeg

# Set the working directory 
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

# Expose port 3000 outside of the container
EXPOSE 3000

# Define commands to run your app using CMD which defines runtime
CMD [ "npm", "run", "serve" ]





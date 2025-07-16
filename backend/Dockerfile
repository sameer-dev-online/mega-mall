# Step 1: Base image
FROM node

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json & install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy all files
COPY . .

# Step 5: Expose the port
EXPOSE 5000

# Step 6: Start the app
CMD ["npm", "run", "dev"]

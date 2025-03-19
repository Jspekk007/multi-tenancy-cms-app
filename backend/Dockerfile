# Step 1: Use an official Node.js runtime as a parent image
FROM node:latest

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the root-level package.json and yarn.lock (important for Yarn workspaces)
COPY package*.json ./

# Step 4: Install dependencies for the backend (uses Yarn workspaces resolution)
RUN yarn install --frozen-lockfile

# Step 5: Copy the rest of the backend application code
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Step 6: Build the application
RUN yarn build

# Step 7: Expose the port that the backend app will run on
EXPOSE 3000

# Step 8: Start the backend app
CMD ["npm", "run", "start:prod"]

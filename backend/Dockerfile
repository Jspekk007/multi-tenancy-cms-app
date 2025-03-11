# Step 1: Use an official Node.js runtime as a parent image
FROM node:22

# Step 2: Set the working directory inside the container
WORKDIR /app/backend

# Step 3: Copy the root-level package.json and yarn.lock (important for Yarn workspaces)
COPY package.json yarn.lock ../

# Step 4: Copy the backend-specific package.json
COPY backend/package.json ./

# Step 5: Install dependencies for the backend (uses Yarn workspaces resolution)
RUN yarn install --frozen-lockfile

# Step 6: Copy the rest of the backend application code
COPY backend ./

# Step 7: Expose the port that the backend app will run on
EXPOSE 3000

# Step 8: Start the backend app
CMD ["yarn", "start"]

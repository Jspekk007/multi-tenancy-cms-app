# Step 1: Use an official Node.js runtime as a parent image
FROM node:20

# Step 2: Set the working directory inside the container
WORKDIR /app/backend

# Step 3: Copy the root-level package.json and yarn.lock (important for Yarn workspaces)
COPY package.json yarn.lock ../

# Step 4: Copy the backend-specific package.json
COPY backend/package.json ./

# Step 5: Install dependencies for the backend (uses Yarn workspaces resolution)
RUN apt-get update && \
    apt-get install -y --no-install-recommends make gcc g++ python3 && \
    yarn install --frozen-lockfile && \
    yarn cache clean &&  \
    yarn add nodemon ts-node -D && \
    npm rebuild bcrypt --build-from-source && \
    apt-get remove -y make gcc g++ python3 && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Step 6: Copy the rest of the backend application code
COPY backend ./

# Step 7: Expose the port that the backend app will run on
EXPOSE 3000

# Step 8: Start the backend app with nodemon for development
CMD ["yarn", "start:debug"]
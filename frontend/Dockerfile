# Step 1: Use an official Node.js runtime as a parent image
FROM node:20

# Step 2: Set the working directory inside the container
WORKDIR /app/frontend

# Step 3: Copy the root-level package.json and yarn.lock (important for Yarn workspaces)
COPY package.json yarn.lock ../

# Step 4: Copy the frontend-specific package.json
COPY frontend/package.json ./

# Step 5: Install dependencies for the frontend (uses Yarn workspaces resolution)
RUN yarn install --frozen-lockfile

# Step 6: Copy the rest of the frontend application code
COPY frontend ./

# Step 7: Build the Next.js app
RUN yarn build

# Step 8: Expose the port that the app will run on
EXPOSE 3001

# Step 9: Start the Next.js app
CMD ["yarn", "start", "-p", "3001"]
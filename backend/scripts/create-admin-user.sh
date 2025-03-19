#!/bin/sh

set -e  # Exit on error
set -x  # Print commands as they are executed

echo "Starting admin user creation script..."
echo "Current directory: $(pwd)"
echo "Listing contents of current directory:"
ls -la

# Wait for database to be ready
echo "Waiting for database to be ready..."
while ! nc -z db 5432; do
  echo "Database is not ready yet..."
  sleep 1
done
echo "Database is ready!"

# Run the create-admin-user command
echo "Creating admin user..."
echo "Looking for create-admin-user.js in dist/scripts:"
ls -la dist/scripts/
node dist/scripts/create-admin-user.js

echo "Admin user creation completed!" 
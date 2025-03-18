#!/bin/bash

# Wait for the database to be ready
echo "Waiting for the database to be ready..."
sleep 10

# Insert the admin user
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USERNAME -d $DB_DATABASE << EOF
INSERT INTO users (id, email, password, tenantId, createdAt, updatedAt)
VALUES (
  'admin-uuid', 
  'admin@example.com', 
  '\$2b\$10\$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Zf4a2B1yE3y1J1y1y1y1y', -- bcrypt hash for 'password123'
  'tenant123',
  NOW(),
  NOW()
);
EOF

echo "Admin user created successfully."
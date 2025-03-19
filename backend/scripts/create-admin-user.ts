import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../src/core/user/user.entity';  
import { Tenant } from '../src/core/tenant/tenant.entity';
import { Role } from '../src/core/auth/entities/role.entity';
import { UserRole } from '../src/core/auth/entities/user-role.entity';

async function createAdminUser() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, Tenant, Role, UserRole],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('Database connection initialized');

    const adminId = process.env.ADMIN_ID || 'admin-uuid';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
    const adminTenantId = process.env.ADMIN_TENANT_ID || 'tenant123';

    // Check if admin tenant exists
    const tenantRepository = dataSource.getRepository(Tenant);
    let adminTenant = await tenantRepository.findOne({ where: { id: adminTenantId } });

    if (!adminTenant) {
      adminTenant = tenantRepository.create({
        name: 'Admin Tenant',
        domain: 'admin.localhost'
      });
      await tenantRepository.save(adminTenant);
      console.log('Admin tenant created');
    }

    // Check if admin user exists
    const userRepository = dataSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email: adminEmail } });

    if (existingUser) {
      console.log('Admin user already exists');
      await dataSource.destroy();
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminUser = userRepository.create({
      email: adminEmail,
      password: hashedPassword,
      tenant: adminTenant,
      tenantId: adminTenant.id
    });
    await userRepository.save(adminUser);

    // Create admin role if it doesn't exist
    const roleRepository = dataSource.getRepository(Role);
    let adminRole = await roleRepository.findOne({ where: { name: 'admin' } });

    if (!adminRole) {
      adminRole = roleRepository.create({
        name: 'admin',
        description: 'Administrator role with full access',
      });
      await roleRepository.save(adminRole);
      console.log('Admin role created');
    }

    // Assign admin role to user
    const userRoleRepository = dataSource.getRepository(UserRole);
    const userRole = userRoleRepository.create({
      user: adminUser,
      role: adminRole,
    });
    await userRoleRepository.save(userRole);

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

createAdminUser(); 
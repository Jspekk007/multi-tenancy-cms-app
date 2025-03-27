import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './user-role.entity';
import { User } from '../../user/user.entity';
import { Role } from './role.entity';

describe('UserRole Entity', () => {
  let repository: Repository<UserRole>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(UserRole),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get<Repository<UserRole>>(getRepositoryToken(UserRole));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create a user role with required fields', () => {
    const userRole = new UserRole();
    userRole.userId = 'test-user-id';
    userRole.roleId = 'test-role-id';
    userRole.user = new User();
    userRole.role = new Role();

    expect(userRole.userId).toBe('test-user-id');
    expect(userRole.roleId).toBe('test-role-id');
    expect(userRole.user).toBeDefined();
    expect(userRole.role).toBeDefined();
  });
}); 
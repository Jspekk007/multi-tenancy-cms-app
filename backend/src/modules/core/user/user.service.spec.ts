import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Role } from '../auth/entities/role.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './create-user.dto';

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockRoleRepository = {
  findByIds: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;
  let _userRepository: Repository<User>;
  let _roleRepository: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(Role), useValue: mockRoleRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    _userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    _roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        tenantId: 'tenant1',
        roleIds: ['role1'],
      };

      const hashMock = jest.spyOn(bcrypt, 'hash');
      (hashMock as jest.Mock).mockResolvedValue('mockedHashedPassword' as unknown as never);

      mockUserRepository.findOne.mockResolvedValue(null);
      mockRoleRepository.findByIds.mockResolvedValue([{ id: 'role1' }]);
      mockUserRepository.create.mockImplementation((user) => user);
      mockUserRepository.save.mockResolvedValue({ id: 'user1', ...createUserDto });

      const result = await userService.createUser(createUserDto);
      expect(result).toHaveProperty('id');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com', tenantId: 'tenant1' } });
      expect(mockRoleRepository.findByIds).toHaveBeenCalledWith(['role1']);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'mockedHashedPassword',
        tenantId: 'tenant1',
        roles: [{ id: 'role1' }],
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 'user1' });
      
      await expect(userService.createUser({ email: 'test@example.com', password: 'password', tenantId: 'tenant1', roleIds: [] }))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email and tenantId', async () => {
      const user = { id: 'user1', email: 'test@example.com', tenantId: 'tenant1', roles: [] };
      mockUserRepository.findOne.mockResolvedValue(user);
      
      const result = await userService.findByEmail('test@example.com', 'tenant1');
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      
      await expect(userService.findByEmail('notfound@example.com', 'tenant1'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const user = { id: 'user1', email: 'test@example.com', roles: [] };
      mockUserRepository.findOne.mockResolvedValue(user);
      
      const result = await userService.findById('user1');
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      
      await expect(userService.findById('invalid-id'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('assignRoles', () => {
    it('should assign roles to a user', async () => {
      const user = { id: 'user1', roles: [] };
      mockUserRepository.findOne.mockResolvedValue(user);
      mockRoleRepository.findByIds.mockResolvedValue([{ id: 'role1' }]);
      mockUserRepository.save.mockResolvedValue({ ...user, roles: [{ id: 'role1' }] });

      const result = await userService.assignRoles('user1', ['role1']);
      expect(result.roles).toHaveLength(1);
      expect(mockUserRepository.save).toHaveBeenCalledWith({ id: 'user1', roles: [{ id: 'role1' }] });
    });

    it('should throw BadRequestException if role IDs are invalid', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 'user1', roles: [] });
      mockRoleRepository.findByIds.mockResolvedValue([]);

      await expect(userService.assignRoles('user1', ['invalid-role']))
        .rejects.toThrow(BadRequestException);
    });
  });
});

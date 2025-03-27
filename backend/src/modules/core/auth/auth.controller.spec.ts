import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { User } from '../user/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
    createUser: jest.fn(),
    assignRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return tokens when credentials are valid', async () => {
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'password',
      };

      const mockUser = {
        id: '1',
        email: 'test@test.com',
        tenantId: 'tenant-1',
      } as User;

      const mockTokens = {
        access_token: 'mockAccessToken',
        refresh_token: 'mockRefreshToken',
      };

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(mockTokens);

      const result = await controller.login(loginDto);

      expect(result).toEqual(mockTokens);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'wrong-password',
      };

      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('should return new tokens', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'mockRefreshToken',
      };

      const mockTokens = {
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      };

      mockAuthService.refreshToken.mockResolvedValue(mockTokens);

      const result = await controller.refreshToken(refreshTokenDto);

      expect(result).toEqual(mockTokens);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshTokenDto.refreshToken);
    });
  });

  describe('logout', () => {
    it('should call logout service', async () => {
      const mockUser = {
        id: '1',
        tenantId: 'tenant-1',
      } as User;

      const mockRequest = {
        user: mockUser,
      };

      await controller.logout(mockRequest as any);

      expect(mockAuthService.logout).toHaveBeenCalledWith(mockUser.id, mockUser.tenantId);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@test.com',
        password: 'password',
        tenantId: 'tenant-1',
        roleIds: ['role-1'],
      };

      const mockUser = {
        id: '2',
        email: 'new@test.com',
        tenantId: 'tenant-1',
      };

      mockAuthService.createUser.mockResolvedValue(mockUser);

      const result = await controller.createUser(createUserDto);

      expect(result).toEqual(mockUser);
      expect(mockAuthService.createUser).toHaveBeenCalledWith(
        createUserDto.email,
        createUserDto.password,
        createUserDto.tenantId,
        createUserDto.roleIds,
      );
    });
  });

  describe('assignRole', () => {
    it('should assign a role to a user', async () => {
      const assignRoleDto: AssignRoleDto = {
        userId: 'user-1',
        roleId: 'role-1',
        tenantId: 'tenant-1',
      };

      const mockUser = {
        id: 'user-1',
        roles: [{ id: 'role-1' }],
      };

      mockAuthService.assignRole.mockResolvedValue(mockUser);

      const result = await controller.assignRole(assignRoleDto);

      expect(result).toEqual(mockUser);
      expect(mockAuthService.assignRole).toHaveBeenCalledWith(
        assignRoleDto.userId,
        assignRoleDto.roleId,
        assignRoleDto.tenantId,
      );
    });
  });
}); 
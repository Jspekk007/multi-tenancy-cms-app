import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from '../user/user.entity'
import { Role } from './entities/role.entity'
import { RefreshToken } from './entities/refresh-token.entity'
import { Tenant } from '../tenant/tenant.entity'
import { Repository } from 'typeorm'
import { TenantContext } from '../tenant/tenant.context'
import * as bcrypt from 'bcrypt'

const mockRepository = () =>
  ({
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    findByIds: jest.fn(),
  }) as unknown as jest.Mocked<Repository<any>>

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mockAccessToken'),
  signAsync: jest.fn().mockResolvedValue('mockAccessToken'),
  verifyAsync: jest.fn().mockResolvedValue({
    sub: 'userId',
    tenantId: 'tenant-1',
    email: 'test@test.com',
  }),
}

const mockTenantContext = {
  getTenant: jest.fn().mockReturnValue({ id: 'tenantId' }),
}

describe('AuthService', () => {
  let authService: AuthService
  let userRepository: jest.Mocked<Repository<User>>
  let _roleRepository: jest.Mocked<Repository<Role>>
  let refreshTokenRepository: jest.Mocked<Repository<RefreshToken>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('test-secret') },
        },
        { provide: getRepositoryToken(User), useFactory: mockRepository },
        { provide: getRepositoryToken(Role), useFactory: mockRepository },
        {
          provide: getRepositoryToken(RefreshToken),
          useFactory: mockRepository,
        },
        { provide: getRepositoryToken(Tenant), useFactory: mockRepository },
        { provide: TenantContext, useValue: mockTenantContext },
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
    userRepository = module.get(getRepositoryToken(User))
    _roleRepository = module.get(getRepositoryToken(Role))
    refreshTokenRepository = module.get(getRepositoryToken(RefreshToken))
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  describe('validateUser', () => {
    it('should return user without password if valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        password: await bcrypt.hash('password', 10),
        tenantId: 'tenant-1',
        tenant: { id: 'tenant-1' },
        userRoles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User
      userRepository.findOne.mockResolvedValue(mockUser)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never)

      const result = await authService.validateUser('test@test.com', 'password')
      expect(result).toHaveProperty('email', 'test@test.com')
    })

    it('should return null if user not found or password incorrect', async () => {
      userRepository.findOne.mockResolvedValue(null)
      const result = await authService.validateUser('test@test.com', 'password')
      expect(result).toBeNull()
    })
  })

  describe('login', () => {
    it('should return access and refresh tokens', async () => {
      const user = { id: 'userId', email: 'test@test.com' } as User
      const result = await authService.login(user)
      expect(result).toEqual({
        access_token: 'mockAccessToken',
        refresh_token: 'mockAccessToken',
      })
    })
  })

  describe('refreshToken', () => {
    it('should return new tokens if valid', async () => {
      const mockRefreshToken = {
        id: 'tokenId',
        token: 'mockRefreshToken',
        userId: 'userId',
        tenantId: 'tenant-1',
        expiresAt: new Date(Date.now() + 10000),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as RefreshToken
      refreshTokenRepository.findOne.mockResolvedValue(mockRefreshToken)

      const mockUser = {
        id: 'userId',
        email: 'test@test.com',
        password: 'hashed-password',
        tenantId: 'tenant-1',
        tenant: { id: 'tenant-1' },
        userRoles: [],
        roles: [{ name: 'admin' }],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User
      userRepository.findOne.mockResolvedValue(mockUser)

      const result = await authService.refreshToken('mockRefreshToken')
      expect(result).toEqual({
        accessToken: 'mockAccessToken',
        refreshToken: 'mockAccessToken',
      })
    })

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      refreshTokenRepository.findOne.mockResolvedValue(null)
      await expect(authService.refreshToken('invalidToken')).rejects.toThrow(
        'Invalid refresh token'
      )
    })
  })

  describe('logout', () => {
    it('should delete refresh tokens', async () => {
      await authService.logout('userId', 'tenantId')
      expect(refreshTokenRepository.delete).toHaveBeenCalledWith({
        userId: 'userId',
        tenantId: 'tenantId',
      })
    })
  })
})

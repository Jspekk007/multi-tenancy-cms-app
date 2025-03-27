import { RefreshTokenStrategy } from './refresh-token.strategy';
import { ConfigService } from '@nestjs/config';
import { Repository, MoreThan } from 'typeorm';
import { User } from '../../user/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RefreshTokenStrategy', () => {
  let refreshTokenStrategy: RefreshTokenStrategy;
  let userRepository: Repository<User>;
  let refreshTokenRepository: Repository<RefreshToken>;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenStrategy,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('test-refresh-secret') },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    refreshTokenStrategy = module.get<RefreshTokenStrategy>(RefreshTokenStrategy);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    refreshTokenRepository = module.get<Repository<RefreshToken>>(getRepositoryToken(RefreshToken));
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(refreshTokenStrategy).toBeDefined();
  });

  it('should validate and return user data', async () => {
    const payload = { sub: '123', token: 'refresh-token', tenantId: 'tenant-1', email: 'test@example.com' };
    const refreshToken = { id: 'refresh-1', token: 'refresh-token', userId: '123', tenantId: 'tenant-1', expiresAt: new Date(Date.now() + 10000) };
    const user = { id: '123', email: 'test@example.com', tenantId: 'tenant-1', roles: ['admin'] };

    (refreshTokenRepository.findOne as jest.Mock).mockResolvedValue(refreshToken);
    (userRepository.findOne as jest.Mock).mockResolvedValue(user);

    const result = await refreshTokenStrategy.validate(payload);
    expect(result).toEqual({
      id: '123', 
      email: 'test@example.com',
      tenantId: 'tenant-1',
      roles: ['admin'],
      refreshTokenId: 'refresh-1',
    });
    expect(refreshTokenRepository.findOne).toHaveBeenCalledWith({
      where: {
        token: 'refresh-token',
        userId: '123',
        tenantId: 'tenant-1',
        expiresAt: expect.any(Object),
      },
    });
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: '123' }, relations: ['roles'] });
  });

  it('should throw UnauthorizedException if refresh token is not found', async () => {
    (refreshTokenRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(refreshTokenStrategy.validate({ sub: '123', token: 'invalid-token', tenantId: 'tenant-1', email: 'test@example.com' }))
      .rejects.toThrow(new UnauthorizedException('Invalid refresh token'));
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    const refreshToken = { id: 'refresh-1', token: 'refresh-token', userId: '123', tenantId: 'tenant-1', expiresAt: new Date(Date.now() + 10000) };
    (refreshTokenRepository.findOne as jest.Mock).mockResolvedValue(refreshToken);
    (userRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(refreshTokenStrategy.validate({ sub: '123', token: 'refresh-token', tenantId: 'tenant-1', email: 'test@example.com' }))
      .rejects.toThrow(new UnauthorizedException('User not found'));
  });
});

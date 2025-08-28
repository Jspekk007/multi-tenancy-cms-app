import { JwtStrategy } from './jwt.strategy'
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'
import { User } from '../../user/user.entity'
import { UnauthorizedException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy
  let _userRepository: Repository<User>
  let _configService: ConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('test-secret') },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile()

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy)
    _userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    _configService = module.get<ConfigService>(ConfigService)
  })

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined()
  })

  it('should validate and return user data', async () => {
    const payload = { sub: '123' }
    const user = {
      id: '123',
      email: 'test@example.com',
      tenantId: 'tenant-1',
      roles: ['admin'],
    }

    ;(_userRepository.findOne as jest.Mock).mockResolvedValue(user)

    const result = await jwtStrategy.validate(payload)
    expect(result).toEqual({
      id: '123',
      email: 'test@example.com',
      tenantId: 'tenant-1',
      roles: ['admin'],
    })
    expect(_userRepository.findOne).toHaveBeenCalledWith({
      where: { id: '123' },
      relations: ['roles'],
    })
  })

  it('should throw UnauthorizedException if user is not found', async () => {
    ;(_userRepository.findOne as jest.Mock).mockResolvedValue(null)

    await expect(jwtStrategy.validate({ sub: '123' })).rejects.toThrow(
      UnauthorizedException
    )
    expect(_userRepository.findOne).toHaveBeenCalledWith({
      where: { id: '123' },
      relations: ['roles'],
    })
  })
})

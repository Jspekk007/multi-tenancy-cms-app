import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TenantService } from './modules/core/tenant/tenant.service'
import { Repository } from 'typeorm'
import { Content } from './modules/content/entities/content.entity'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('AppController', () => {
  let appController: AppController
  let _appService: AppService
  let _tenantService: TenantService
  let _contentRepository: Repository<Content>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: { getHello: jest.fn().mockReturnValue('Hello World!') },
        },
        {
          provide: TenantService,
          useValue: { getAllTenants: jest.fn().mockResolvedValue([]) },
        },
        {
          provide: getRepositoryToken(Content),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile()

    appController = module.get<AppController>(AppController)
    _appService = module.get<AppService>(AppService)
    _tenantService = module.get<TenantService>(TenantService)
    _contentRepository = module.get<Repository<Content>>(
      getRepositoryToken(Content)
    )
  })

  it('should return hello world', () => {
    expect(appController.getHello()).toBe('Hello World!')
  })

  it('should return an empty tenant list', async () => {
    const result = await appController.debugTenants()
    expect(result).toEqual({
      tenants: [],
      message: 'Found 0 tenants in database',
    })
  })

  it('should create new test content', async () => {
    const content = { title: 'Test Title', body: 'Test Body' }
    const savedContent = { id: 1, ...content }

    ;(_contentRepository.create as jest.Mock).mockReturnValue(savedContent)
    ;(_contentRepository.save as jest.Mock).mockResolvedValue(savedContent)

    const result = await appController.createTestContent(content)
    expect(result).toEqual(savedContent)
    expect(_contentRepository.create).toHaveBeenCalledWith(content)
    expect(_contentRepository.save).toHaveBeenCalledWith(savedContent)
  })

  it('should return an empty list of test content', async () => {
    const result = await appController.getTestContent()
    expect(result).toEqual([])
    expect(_contentRepository.find).toHaveBeenCalled()
  })
})

import { Repository } from 'typeorm'
import { Role } from './role.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Test, TestingModule } from '@nestjs/testing'
describe('Role Entity', () => {
  let repository: Repository<Role>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Role),
          useValue: {
            save: jest.fn().mockImplementation((role) => ({
              id: '1',
              ...role,
              createdAt: new Date(),
              updatedAt: new Date(),
            })),
          },
        },
      ],
    }).compile()

    repository = module.get<Repository<Role>>(getRepositoryToken(Role))
  })

  it('should be defined', () => {
    expect(repository).toBeDefined()
  })

  it('should create a role with required fields', () => {
    const role = new Role()
    role.name = 'test-role'

    expect(role.name).toBe('test-role')
  })

  it('should create a role with optional fields', () => {
    const role = new Role()
    role.name = 'test-role'
    role.description = 'test-description'

    expect(role.name).toBe('test-role')
    expect(role.description).toBe('test-description')
  })

  it('should save a role to the database', async () => {
    const role = new Role()
    role.name = 'test-role'
    role.description = 'test-description'

    const savedRole = await repository.save(role)

    expect(savedRole.id).toBeDefined()
    expect(savedRole.name).toBe('test-role')
    expect(savedRole.description).toBe('test-description')
    expect(repository.save).toHaveBeenCalledWith(role)
  })
})

import { TenantService } from './tenant.service'
import { Repository } from 'typeorm'
import { Tenant } from './tenant.entity'
import { CreateTenantDto } from './create-tenant.dto'
import { NotFoundException, BadRequestException } from '@nestjs/common'

describe('TenantService', () => {
  let tenantService: TenantService
  let tenantRepository: Repository<Tenant>

  beforeEach(() => {
    tenantRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    } as any

    tenantService = new TenantService(tenantRepository)
  })

  describe('createTenant', () => {
    it('should create and return a tenant', async () => {
      const dto: CreateTenantDto = { name: 'Test Tenant', domain: 'test.com' }
      const savedTenant = { id: '1', ...dto }

      ;(tenantRepository.findOne as jest.Mock).mockResolvedValue(null)
      ;(tenantRepository.create as jest.Mock).mockReturnValue(savedTenant)
      ;(tenantRepository.save as jest.Mock).mockResolvedValue(savedTenant)

      const result = await tenantService.createTenant(dto)
      expect(result).toEqual(savedTenant)
      expect(tenantRepository.findOne).toHaveBeenCalledWith({
        where: { domain: dto.domain },
      })
      expect(tenantRepository.create).toHaveBeenCalledWith(dto)
      expect(tenantRepository.save).toHaveBeenCalledWith(savedTenant)
    })

    it('should throw BadRequestException if tenant already exists', async () => {
      const dto: CreateTenantDto = { name: 'Test Tenant', domain: 'test.com' }
      ;(tenantRepository.findOne as jest.Mock).mockResolvedValue(dto)

      await expect(tenantService.createTenant(dto)).rejects.toThrow(
        BadRequestException
      )
      expect(tenantRepository.findOne).toHaveBeenCalledWith({
        where: { domain: dto.domain },
      })
    })
  })

  describe('findById', () => {
    it('should return a tenant by id', async () => {
      const tenant = {
        id: '1',
        name: 'Test Tenant',
        domain: 'test.com',
        users: [],
      }
      ;(tenantRepository.findOne as jest.Mock).mockResolvedValue(tenant)

      const result = await tenantService.findById('1')
      expect(result).toEqual(tenant)
      expect(tenantRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['users'],
      })
    })

    it('should throw NotFoundException if tenant is not found', async () => {
      ;(tenantRepository.findOne as jest.Mock).mockResolvedValue(null)

      await expect(tenantService.findById('1')).rejects.toThrow(
        NotFoundException
      )
      expect(tenantRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['users'],
      })
    })
  })

  describe('findByDomain', () => {
    it('should return a tenant by domain', async () => {
      const tenant = {
        id: '1',
        name: 'Test Tenant',
        domain: 'test.com',
        users: [],
      }
      ;(tenantRepository.findOne as jest.Mock).mockResolvedValue(tenant)

      const result = await tenantService.findByDomain('test.com')
      expect(result).toEqual(tenant)
      expect(tenantRepository.findOne).toHaveBeenCalledWith({
        where: { domain: 'test.com' },
        relations: ['users'],
      })
    })

    it('should return null if domain is empty or tenant is not found', async () => {
      ;(tenantRepository.findOne as jest.Mock).mockResolvedValue(null)

      const result = await tenantService.findByDomain('unknown.com')
      expect(result).toBeNull()
      expect(tenantRepository.findOne).toHaveBeenCalledWith({
        where: { domain: 'unknown.com' },
        relations: ['users'],
      })
    })
  })

  describe('getAllTenants', () => {
    it('should return all tenants', async () => {
      const tenants = [
        { id: '1', name: 'Tenant One', domain: 'one.com', users: [] },
        { id: '2', name: 'Tenant Two', domain: 'two.com', users: [] },
      ]
      ;(tenantRepository.find as jest.Mock).mockResolvedValue(tenants)

      const result = await tenantService.getAllTenants()
      expect(result).toEqual(tenants)
      expect(tenantRepository.find).toHaveBeenCalledWith({
        relations: ['users'],
      })
    })
  })
})

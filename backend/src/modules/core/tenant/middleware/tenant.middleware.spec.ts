import { TenantMiddleware } from './tenant.middleware'
import { TenantService } from '../tenant.service'
import { ClsService } from 'nestjs-cls'
import { NotFoundException } from '@nestjs/common'

describe('TenantMiddleware', () => {
  let middleware: TenantMiddleware
  let tenantService: TenantService
  let clsService: ClsService
  let mockRequest: any
  let mockResponse: any
  let next: jest.Mock

  beforeEach(() => {
    tenantService = { findByDomain: jest.fn() } as any
    clsService = { set: jest.fn() } as any
    middleware = new TenantMiddleware(tenantService, clsService)

    mockRequest = {
      headers: {},
      get: jest.fn(),
      path: '',
    }
    mockResponse = {}
    next = jest.fn()
  })

  it('should call next() for auth routes without checking tenant', async () => {
    mockRequest.path = '/auth/login'
    await middleware.use(mockRequest, mockResponse, next)
    expect(next).toHaveBeenCalledWith()
    expect(tenantService.findByDomain).not.toHaveBeenCalled()
  })

  it('should retrieve tenant from x-tenant-domain header and set in context', async () => {
    mockRequest.headers['x-tenant-domain'] = 'example.com'
    tenantService.findByDomain = jest
      .fn()
      .mockResolvedValue({ id: 1, name: 'Example' })
    await middleware.use(mockRequest, mockResponse, next)
    expect(tenantService.findByDomain).toHaveBeenCalledWith('example.com')
    expect(clsService.set).toHaveBeenCalledWith('tenant', {
      id: 1,
      name: 'Example',
    })
    expect(next).toHaveBeenCalledWith()
  })

  it('should retrieve tenant from subdomain if no header is provided', async () => {
    mockRequest.get.mockReturnValue('subdomain.example.com')
    tenantService.findByDomain = jest
      .fn()
      .mockResolvedValue({ id: 2, name: 'Subdomain Tenant' })
    await middleware.use(mockRequest, mockResponse, next)
    expect(tenantService.findByDomain).toHaveBeenCalledWith('subdomain')
    expect(clsService.set).toHaveBeenCalledWith('tenant', {
      id: 2,
      name: 'Subdomain Tenant',
    })
    expect(next).toHaveBeenCalledWith()
  })

  it('should throw NotFoundException if tenant is not found', async () => {
    mockRequest.headers['x-tenant-domain'] = 'unknown.com'
    tenantService.findByDomain = jest.fn().mockResolvedValue(null)
    await middleware.use(mockRequest, mockResponse, next)
    expect(next).toHaveBeenCalledWith(
      new NotFoundException('Tenant not found for domain: unknown.com')
    )
  })

  it('should call next with an error if an exception occurs', async () => {
    mockRequest.headers['x-tenant-domain'] = 'error.com'
    const error = new Error('Database error')
    tenantService.findByDomain = jest.fn().mockRejectedValue(error)
    await middleware.use(mockRequest, mockResponse, next)
    expect(next).toHaveBeenCalledWith(error)
  })
})

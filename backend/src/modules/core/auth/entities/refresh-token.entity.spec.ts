import { Repository } from "typeorm";
import { RefreshToken } from "./refresh-token.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

describe('RefreshToken Entity', () => {
    let repository: Repository<RefreshToken>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: getRepositoryToken(RefreshToken),
                    useValue: {
                        save: jest.fn().mockImplementation((refreshToken) => ({
                            id: '1',
                            ...refreshToken,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        }))
                    }
                }
            ]
        }).compile();

        repository = module.get<Repository<RefreshToken>>(getRepositoryToken(RefreshToken));
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    it('should create a refresh token with required fields', () => {
        const refreshToken = new RefreshToken();
        refreshToken.token = 'test-token';
        refreshToken.userId = 'test-user-id';
        refreshToken.tenantId = 'test-tenant-id';
        refreshToken.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    })

    it('should create a refresh token with optional fields', () => {
        const refreshToken = new RefreshToken();
        refreshToken.token = 'test-token';
        refreshToken.userId = 'test-user-id';
        refreshToken.tenantId = 'test-tenant-id';
        
    })      

    it('should save a refresh token to the database', async () => {
        const refreshToken = new RefreshToken();
        refreshToken.token = 'test-token';
        refreshToken.userId = 'test-user-id';
        refreshToken.tenantId = 'test-tenant-id';   

        const savedRefreshToken = await repository.save(refreshToken);

        expect(savedRefreshToken.id).toBeDefined();
        expect(savedRefreshToken.token).toBe('test-token');
        expect(savedRefreshToken.userId).toBe('test-user-id');
        
    })

    it('should find a refresh token by token', async () => {
        const refreshToken = new RefreshToken();
        refreshToken.token = 'test-token';
        refreshToken.userId = 'test-user-id';
        
    })
    
})
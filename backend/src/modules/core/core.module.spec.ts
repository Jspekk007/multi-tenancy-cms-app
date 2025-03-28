import { Test } from "@nestjs/testing";
import { AuthModule } from "./auth/auth.module";
import { CoreModule } from "./core.module";
import { TenantModule } from "./tenant/tenant.module";
import { UserModule } from "./user/user.module";

jest.mock('./user/user.module', () => ({
    UserModule: class MockUserModule {},
  }));
  
  jest.mock('./tenant/tenant.module', () => ({
    TenantModule: class MockTenantModule {},
  }));
  
  jest.mock('./auth/auth.module', () => ({
    AuthModule: class MockAuthModule {},
  }));

describe('CoreModule', () => {
    let moduleRef: any;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [CoreModule],
        }).compile();

        moduleRef = module;
    });

    it('should be defined', () => {
        expect(moduleRef).toBeDefined();
    });

    it('Should import required modules', () => {
        expect(moduleRef.get(UserModule)).toBeDefined();
        expect(moduleRef.get(TenantModule)).toBeDefined();
        expect(moduleRef.get(AuthModule)).toBeDefined();
    });
});
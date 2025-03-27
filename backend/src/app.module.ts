import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CoreModule } from './modules/core/core.module'
import { SeedModule } from './seed/seed.module'
import typeOrmConfig from './config/database.config'
import { ClsModule } from 'nestjs-cls'
import { TenantMiddleware } from './modules/core/tenant/middleware/tenant.middleware'
import { TenantContext } from './modules/core/tenant/tenant.context'
import { Content } from './modules/content/entities/content.entity'
import { User } from './modules/core/user/user.entity'
import { Tenant } from './modules/core/tenant/tenant.entity'
import { Role } from './modules/core/auth/entities/role.entity'
import { RefreshToken } from './modules/core/auth/entities/refresh-token.entity'
import { UserRole } from './modules/core/auth/entities/user-role.entity'

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './../.env',
    }),
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      Content,
      User,
      Tenant,
      Role,
      RefreshToken,
      UserRole,
    ]),
    CoreModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService, TenantContext],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*')
  }
}

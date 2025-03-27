import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CoreModule } from './modules/core/core.module'
import { SeedModule } from './seed/seed.module'
import { ClsModule, ClsMiddleware } from 'nestjs-cls'
import { TenantMiddleware } from './modules/core/tenant/middleware/tenant.middleware'
import { TenantContext } from './modules/core/tenant/tenant.context'
import { Content } from './modules/content/entities/content.entity'
import { User } from './modules/core/user/user.entity'
import { Tenant } from './modules/core/tenant/tenant.entity'
import { Role } from './modules/core/auth/entities/role.entity'
import { RefreshToken } from './modules/core/auth/entities/refresh-token.entity'
import { UserRole } from './modules/core/auth/entities/user-role.entity'
import * as path from 'path'

console.log('ENV PATH:', path.resolve(__dirname, '../../.env'));

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../.env'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT', '5432')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Tenant, Role, RefreshToken, UserRole, Content],
        synchronize: true,
        logging: true,
        retryAttempts: 5,
        retryDelay: 3000,
      }),
      inject: [ConfigService],
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
    consumer
      .apply(ClsMiddleware, TenantMiddleware)
      .forRoutes('*')
  }
}

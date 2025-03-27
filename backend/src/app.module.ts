import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CoreModule } from './modules/core/core.module'
import { SeedModule } from './seed/seed.module'
import typeOrmConfig from './config/database.config'
import { ClsModule } from 'nestjs-cls'
import { TenantContext } from './modules/common/tenant/tenant.context'
import { TenantMiddleware } from './modules/common/tenant/tenant.middleware'

@Module({
  imports: [
    ClsModule.forRoot({
      middleware: { mount: true, generateId: true },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './../.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
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

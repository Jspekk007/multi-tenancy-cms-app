import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SeedService } from './seed/seed.service'
import { ValidationPipe, Logger } from '@nestjs/common'

async function bootstrap() {
  const logger = new Logger('Bootstrap')

  try {
    logger.log('Starting application...')
    const app = await NestFactory.create(AppModule)

    // Enable CORS
    app.enableCors({
      origin: ['http://localhost:3001', 'http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })

    // Enable validation pipes
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      })
    )

    // Run seeds
    logger.log('Running database seeds...')
    const seedService = app.get(SeedService)
    await seedService.seed()
    logger.log('Database seeding completed')

    // Listen on all interfaces
    const port = process.env.PORT ?? 3000
    logger.log(port)
    await app.listen(port, '0.0.0.0')
    logger.log(`Application is running on: http://0.0.0.0:${port}`)
  } catch (error) {
    logger.error('Failed to start application:', error)
    throw error
  }
}
void bootstrap()

import { Command, CommandRunner } from 'nest-commander'
import { SeedService } from './seed.service'

@Command({ name: 'seed', description: 'Seed the database with initial data' })
export class SeedCommand extends CommandRunner {
  constructor(private readonly seedService: SeedService) {
    super()
  }

  async run(): Promise<void> {
    await this.seedService.seed()
  }
}

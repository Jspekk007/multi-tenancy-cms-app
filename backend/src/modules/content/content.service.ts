import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './entities/content.entity';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}

  async findAll() {
    // The tenant filter will be automatically added by the interceptor
    return this.contentRepository.find();
  }

  async findOne(id: string) {
    // The tenant filter will be automatically added by the interceptor
    return this.contentRepository.findOne({ where: { id } });
  }

  async create(content: Partial<Content>) {
    // The tenant ID will be automatically added from the user context
    const newContent = this.contentRepository.create(content);
    return this.contentRepository.save(newContent);
  }
} 
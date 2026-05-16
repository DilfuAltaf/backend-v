import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inbox } from './entities/inbox.entity';

@Injectable()
export class InboxService {
  constructor(
    @InjectRepository(Inbox)
    private readonly inboxRepository: Repository<Inbox>,
  ) {}

  async create(createInboxDto: any): Promise<Inbox> {
    const inbox = this.inboxRepository.create(createInboxDto as Inbox);
    return this.inboxRepository.save(inbox);
  }

  async findAll(): Promise<Inbox[]> {
    return this.inboxRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Inbox> {
    const inbox = await this.inboxRepository.findOne({ where: { id } });
    if (!inbox) throw new NotFoundException('Message not found');
    return inbox;
  }

  async markAsRead(id: string): Promise<Inbox> {
    const inbox = await this.findOne(id);
    inbox.is_read = true;
    return this.inboxRepository.save(inbox);
  }

  async remove(id: string): Promise<void> {
    const inbox = await this.findOne(id);
    await this.inboxRepository.remove(inbox);
  }
}

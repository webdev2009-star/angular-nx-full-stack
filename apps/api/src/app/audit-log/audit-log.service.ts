import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { IAuditLog } from '@turbovets/data';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async findAll(organizationId: string): Promise<IAuditLog[]> {
    return this.auditLogRepository.find({
      where: { user: { organizationId } },
      relations: ['user'],
      order: { timestamp: 'DESC' },
      take: 100, // Limit to last 100 logs
    });
  }
}

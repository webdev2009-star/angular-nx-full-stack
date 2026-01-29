import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { CurrentUser, RequirePermission } from '@turbovets/auth';
import { PermissionsGuard } from '@turbovets/auth';
import { JwtPayload, IAuditLog, PermissionAction, ResourceType } from '@turbovets/data';

@Controller('audit-log')
@UseGuards(PermissionsGuard)
export class AuditLogController {
  constructor(private auditLogService: AuditLogService) {}

  @Get()
  @RequirePermission({ resource: ResourceType.AUDIT_LOG, action: PermissionAction.READ })
  async findAll(@CurrentUser() user: JwtPayload): Promise<IAuditLog[]> {
    return this.auditLogService.findAll(user.organizationId);
  }
}

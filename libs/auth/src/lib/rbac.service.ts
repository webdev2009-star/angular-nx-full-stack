import { Injectable } from '@nestjs/common';
import { UserRole, PermissionAction, ResourceType } from '@turbovets/data';

interface PermissionRule {
  role: UserRole;
  resource: ResourceType;
  actions: PermissionAction[];
}

@Injectable()
export class RbacService {
  private permissions: PermissionRule[] = [
    // OWNER permissions - full access to everything
    {
      role: UserRole.OWNER,
      resource: ResourceType.TASK,
      actions: [
        PermissionAction.CREATE,
        PermissionAction.READ,
        PermissionAction.UPDATE,
        PermissionAction.DELETE,
        PermissionAction.MANAGE
      ]
    },
    {
      role: UserRole.OWNER,
      resource: ResourceType.AUDIT_LOG,
      actions: [PermissionAction.READ, PermissionAction.MANAGE]
    },
    {
      role: UserRole.OWNER,
      resource: ResourceType.USER,
      actions: [
        PermissionAction.CREATE,
        PermissionAction.READ,
        PermissionAction.UPDATE,
        PermissionAction.DELETE,
        PermissionAction.MANAGE
      ]
    },
    {
      role: UserRole.OWNER,
      resource: ResourceType.ORGANIZATION,
      actions: [
        PermissionAction.CREATE,
        PermissionAction.READ,
        PermissionAction.UPDATE,
        PermissionAction.DELETE,
        PermissionAction.MANAGE
      ]
    },
    // ADMIN permissions - can manage tasks and read audit logs
    {
      role: UserRole.ADMIN,
      resource: ResourceType.TASK,
      actions: [
        PermissionAction.CREATE,
        PermissionAction.READ,
        PermissionAction.UPDATE,
        PermissionAction.DELETE
      ]
    },
    {
      role: UserRole.ADMIN,
      resource: ResourceType.AUDIT_LOG,
      actions: [PermissionAction.READ]
    },
    {
      role: UserRole.ADMIN,
      resource: ResourceType.USER,
      actions: [PermissionAction.READ]
    },
    // VIEWER permissions - can only view tasks
    {
      role: UserRole.VIEWER,
      resource: ResourceType.TASK,
      actions: [PermissionAction.READ]
    }
  ];

  hasPermission(role: UserRole, resource: ResourceType, action: PermissionAction): boolean {
    const rule = this.permissions.find(
      (p) => p.role === role && p.resource === resource
    );
    
    if (!rule) {
      return false;
    }
    
    return rule.actions.includes(action);
  }

  canAccessOrganization(userOrgId: string, userParentOrgId: string | undefined, targetOrgId: string): boolean {
    // User can access their own organization
    if (userOrgId === targetOrgId) {
      return true;
    }
    
    // User can access child organizations if they have a parent org relationship
    if (userParentOrgId && userParentOrgId === targetOrgId) {
      return true;
    }
    
    return false;
  }

  getRoleHierarchy(role: UserRole): UserRole[] {
    switch (role) {
      case UserRole.OWNER:
        return [UserRole.OWNER, UserRole.ADMIN, UserRole.VIEWER];
      case UserRole.ADMIN:
        return [UserRole.ADMIN, UserRole.VIEWER];
      case UserRole.VIEWER:
        return [UserRole.VIEWER];
      default:
        return [];
    }
  }
}

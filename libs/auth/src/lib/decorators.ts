import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole, PermissionAction, ResourceType } from '@turbovets/data';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export const PERMISSIONS_KEY = 'permissions';
export interface RequiredPermission {
  resource: ResourceType;
  action: PermissionAction;
}
export const RequirePermission = (...permissions: RequiredPermission[]) => 
  SetMetadata(PERMISSIONS_KEY, permissions);

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

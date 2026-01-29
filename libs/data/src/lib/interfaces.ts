import { UserRole, TaskStatus, TaskCategory, PermissionAction, ResourceType } from './enums';

export interface IUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  organizationId: string;
  parentOrganizationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrganization {
  id: string;
  name: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  category: TaskCategory;
  ownerId: string;
  organizationId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  owner?: IUser;
}

export interface IPermission {
  id: string;
  role: UserRole;
  resource: ResourceType;
  action: PermissionAction;
  createdAt: Date;
}

export interface IAuditLog {
  id: string;
  userId: string;
  action: string;
  resource: ResourceType;
  resourceId: string;
  details: string;
  ipAddress?: string;
  timestamp: Date;
  user?: IUser;
}

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: UserRole;
  organizationId: string;
  parentOrganizationId?: string;
}

export interface LoginResponse {
  access_token: string;
  user: Omit<IUser, 'password'>;
}

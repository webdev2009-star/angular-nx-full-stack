import { TaskStatus, TaskCategory } from './enums';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
  organizationName?: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  status?: TaskStatus;
  category?: TaskCategory;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  category?: TaskCategory;
  order?: number;
}

export interface TaskFilterDto {
  status?: TaskStatus;
  category?: TaskCategory;
  search?: string;
}

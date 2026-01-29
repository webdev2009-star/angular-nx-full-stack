import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private orgsRepository: Repository<Organization>,
  ) {}

  async create(orgData: Partial<Organization>): Promise<Organization> {
    const org = this.orgsRepository.create(orgData);
    return this.orgsRepository.save(org);
  }

  async findById(id: string): Promise<Organization | null> {
    return this.orgsRepository.findOne({ where: { id } });
  }

  async getOrgHierarchy(orgId: string): Promise<string[]> {
    const org = await this.findById(orgId);
    if (!org) return [];
    
    const orgIds = [orgId];
    
    // Add children orgs
    if (org.parentId) {
      orgIds.push(org.parentId);
    }
    
    // Find child organizations
    const children = await this.orgsRepository.find({ where: { parentId: orgId } });
    children.forEach(child => orgIds.push(child.id));
    
    return orgIds;
  }
}

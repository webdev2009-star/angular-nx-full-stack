import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { LoginDto, RegisterDto, JwtPayload, LoginResponse, UserRole } from '@turbovets/data';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private organizationsService: OrganizationsService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<LoginResponse> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    // Create organization if provided
    let organization;
    if (registerDto.organizationName) {
      organization = await this.organizationsService.create({
        name: registerDto.organizationName,
      });
    } else {
      // Create default organization
      organization = await this.organizationsService.create({
        name: `${registerDto.username}'s Organization`,
      });
    }

    const user = await this.usersService.create({
      email: registerDto.email,
      username: registerDto.username,
      password: hashedPassword,
      role: UserRole.OWNER, // First user of org is owner
      organizationId: organization.id,
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      organizationId: user.organizationId,
      parentOrganizationId: user.parentOrganizationId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        organizationId: user.organizationId,
        parentOrganizationId: user.parentOrganizationId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      organizationId: user.organizationId,
      parentOrganizationId: user.parentOrganizationId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        organizationId: user.organizationId,
        parentOrganizationId: user.parentOrganizationId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}

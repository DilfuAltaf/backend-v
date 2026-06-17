import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(loginDto: any) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !user.password) throw new UnauthorizedException('Invalid credentials');

    // AUTO-FIX roles for testing accounts if they got messed up (e.g. from registration)
    let roleChanged = false;
    if (user.email === 'superadmin@example.com' && user.role !== Role.SUPER_ADMIN) {
      user.role = Role.SUPER_ADMIN;
      roleChanged = true;
    } else if (user.email === 'admin@example.com' && user.role !== Role.ADMIN) {
      user.role = Role.ADMIN;
      roleChanged = true;
    } else if (user.email === 'teacher@example.com' && user.role !== Role.TEACHER) {
      user.role = Role.TEACHER;
      roleChanged = true;
    } else if (user.email === 'user@example.com' && user.role !== Role.USER) {
      user.role = Role.USER;
      roleChanged = true;
    }

    if (roleChanged) {
      await this.usersService.update(user.id, { role: user.role });
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    };
  }

  async register(registerDto: any) {
    // We enforce the 'USER' role so anyone registering publicly cannot become an admin
    const newUser = await this.usersService.create({
      ...registerDto,
      role: Role.USER,
    });

    const payload = { email: newUser.email, sub: newUser.id, role: newUser.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role
      }
    };
  }
}

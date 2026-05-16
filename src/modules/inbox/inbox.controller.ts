import { Controller, Get, Post, Delete, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InboxService } from './inbox.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Inbox / Contact')
@Controller('inbox')
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @ApiOperation({ summary: 'Send a message' })
  @Post()
  create(@Body() createDto: any) {
    return this.inboxService.create(createDto);
  }

  @ApiOperation({ summary: 'Get all messages (Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get()
  findAll() {
    return this.inboxService.findAll();
  }

  @ApiOperation({ summary: 'Get message by ID (Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inboxService.findOne(id);
  }

  @ApiOperation({ summary: 'Mark message as read (Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.inboxService.markAsRead(id);
  }

  @ApiOperation({ summary: 'Delete message (Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inboxService.remove(id);
  }
}

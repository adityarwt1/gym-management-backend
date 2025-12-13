import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Controller('leads')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  /**
   * CREATE LEAD
   * POST /leads
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  /**
   * FIND ALL LEADS
   * GET /leads
   * Query params: assignedToId, interestLevel, followUpStatus, page, limit
   */
  @Get()
  findAll(
    @Query('token') token: string,
    @Query('interestLevel') interestLevel?: string,
    @Query('followUpStatus') followUpStatus?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.leadsService.findAll({
      token,
      interestLevel,
      followUpStatus,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    });
  }

  /**
   * FIND ONE LEAD
   * GET /leads/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leadsService.findOne(id);
  }

  /**
   * UPDATE LEAD
   * PATCH /leads/:id
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeadDto: UpdateLeadDto,
  ) {
    return this.leadsService.update(id, updateLeadDto);
  }

  /**
   * DELETE LEAD
   * DELETE /leads/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.leadsService.remove(id);
  }

  /**
   * ADD NOTE TO LEAD
   * POST /leads/:id/notes
   */
  @Post(':id/notes')
  @HttpCode(HttpStatus.CREATED)
  addNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { note: string; date?: string },
  ) {
    return this.leadsService.addNote(id, body.note, body.date);
  }
}

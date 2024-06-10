import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from 'src/events/create-event.dto';
import { UpdateEventDto } from 'src/events/update-event.dto';
import { Event } from '../events/event.entity';
import { Like, MoreThan, type Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('events')
export class EventsController {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  @Get()
  async findAll() {
    return await this.repository.find();
  }

  @Get('/practice')
  async practice() {
    return await this.repository.find({
      select: ['id', 'when'],
      take: 2,
      order: {
        id: 'DESC',
      },
      where: [
        {
          id: MoreThan(3),
          when: MoreThan(new Date('2021-02-12T13:00:00')),
        },
        {
          description: Like('%meet%'),
        },
      ],
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {
    return await this.repository.findOneById(id);
  }

  @Post()
  async create(@Body() input: CreateEventDto) {
    return await this.repository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() input: UpdateEventDto) {
    // Find event by id
    const event = await this.repository.findOneById(id);

    //  If event not found, throw an exception
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return await this.repository.update(id, {
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    return this.repository.delete(id);
  }
}

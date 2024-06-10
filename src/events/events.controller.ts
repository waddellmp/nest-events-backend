import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from 'src/create-event/create-event.dto';
import { UpdateEventDto } from 'src/update-event.dto/update-event.dto';
import { Event } from '../entities/event.entity';

@Controller('events')
export class EventsController {
  private events: Event[] = [
    {
      id: 1,
      name: 'Event 1',
      description: 'Description 1',
      when: new Date('2021-10-10'),
      address: 'Address 1',
    },
    {
      id: 2,
      name: 'Event 2',
      description: 'Description 2',
      when: new Date('2021-10-10'),
      address: 'Address 2',
    },
  ];

  @Get()
  findAll(): Event[] {
    return this.events;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.events.find((event) => {
      return event.id === parseInt(id);
    });
  }

  @Post()
  create(@Body() input: CreateEventDto): Event {
    const event = {
      ...input,
      when: new Date(input.when),
      id: this.events.length + 1,
    };
    this.events.push(event);
    return event;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateEventDto) {
    const index = this.events.findIndex((event) => event.id === parseInt(id));
    if (index === -1) {
      throw new NotFoundException();
    }
    this.events[index] = {
      ...this.events[index],
      ...input,
      when: input.when ? new Date(input.when) : this.events[index].when,
    };

    return this.events[index];
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    this.events = this.events.filter((event) => event.id !== parseInt(id));
  }
}

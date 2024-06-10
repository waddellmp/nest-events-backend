import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from 'src/dtos/create-event/create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}

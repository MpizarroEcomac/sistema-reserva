import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from '../../database/entities/resource.entity';
import { ResourceType } from '../../database/entities/resource-type.entity';
import { Site } from '../../database/entities/site.entity';
import { Booking } from '../../database/entities/booking.entity';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';

@Module({
  imports: [TypeOrmModule.forFeature([Resource, ResourceType, Site, Booking])],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService],
})
export class ResourcesModule {}
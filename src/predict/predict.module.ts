import { Module } from '@nestjs/common';
import { PredictService } from './predict.service';
import { PredictController } from './predict.controller';
import { ModelService } from './model.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from './storage.service';

@Module({
  controllers: [PredictController],
  providers: [PredictService, ModelService, PrismaService, StorageService]
})
export class PredictModule { }

import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PredictService } from './predict.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('predict')
export class PredictController {
  constructor(private readonly predictService: PredictService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async predict(@UploadedFile() img: Express.Multer.File) {}
}

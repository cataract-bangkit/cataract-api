import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PredictService } from './predict.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsPublic, fail, success } from 'src/utils';

@Controller('predict')
export class PredictController {
  constructor(private readonly predictService: PredictService) { }

  @Post()
  @IsPublic()
  @UseInterceptors(FileInterceptor('image'))
  async predict(@UploadedFile() img: Express.Multer.File) {
    if (!img) {
      throw new BadRequestException(fail('image is required.'))
    }

    const result = await this.predictService.predict(img)
    return success("Successfully predicted", { result })
  }
}

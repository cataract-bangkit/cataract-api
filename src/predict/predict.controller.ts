import { BadRequestException, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PredictService } from './predict.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReqUser, RequestUser, fail, success } from 'src/utils';

@Controller('predict')
export class PredictController {
  constructor(private readonly predictService: PredictService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async predict(@UploadedFile() img: Express.Multer.File, @ReqUser() user: RequestUser) {
    if (!img) {
      throw new BadRequestException(fail('image is required.'))
    }

    const result = await this.predictService.predict(img, user.id)
    return success("Successfully predicted", result)
  }

  @Get('/histories')
  async getHistories(@ReqUser() user: RequestUser) {
    const history = await this.predictService.getHistories(user.id)
    return success("Successfully fetched prediction history", { history })
  }
}

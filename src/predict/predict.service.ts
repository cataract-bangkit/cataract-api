import { BadRequestException, Injectable, PayloadTooLargeException } from "@nestjs/common";
import { ResponseErrorCode, fail } from "src/utils";
import { ModelService } from "./model.service";
import { PrismaService } from "src/prisma/prisma.service";
import { StorageService } from "./storage.service";

@Injectable()
export class PredictService {
	constructor(private readonly prisma: PrismaService, private readonly modelService: ModelService, private readonly storageService: StorageService) { }

	async predict(img: Express.Multer.File, userId: string) {
		if (img.size > 5000000) {
			throw new PayloadTooLargeException(fail("Image too large. Maximum image size is 5mb.", ResponseErrorCode.ERR_5))
		}

		const filename = img.originalname.toLowerCase()

		if (!filename.endsWith("png") && !filename.endsWith("jpg") && !filename.endsWith("jpeg")) {
			throw new BadRequestException(fail("File has invalid extension. Allowed extensions are png/jpg/jpeg.", ResponseErrorCode.ERR_6))
		}

		const { result, confidence } = await this.modelService.predict(img.buffer)
		const date = new Date()

		const imgUrl = await this.storageService.uploadImage(img)

		const { userId: _userId, ...history } = await this.prisma.history.create({
			data: {
				result,
				imgUrl,
				confidence,
				predictedAt: date,
				userId
			}
		})


		const data = {
			result: history
		}

		return data
	}

	async getHistories(userId: string) {
		const histories = await this.prisma.history.findMany({
			select: {
				id: true,
				result: true,
				imgUrl: true,
				confidence: true,
				predictedAt: true,
				userId: false
			},
			where: {
				userId
			}
		})

		return histories
	}
}

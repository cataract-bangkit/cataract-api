import { BadRequestException, Injectable, PayloadTooLargeException } from "@nestjs/common";
import { ResponseErrorCode, fail } from "src/utils";

@Injectable()
export class PredictService {
	async predict(img: Express.Multer.File) {
		if (img.size > 5000000) {
			throw new PayloadTooLargeException(fail("Image too large. Maximum image size is 5mb.", ResponseErrorCode.ERR_5))
		}

		const filename = img.originalname.toLowerCase()

		if (!filename.endsWith("png") && !filename.endsWith("jpg") && !filename.endsWith("jpeg")) {
			throw new BadRequestException(fail("File has invalid extension. Allowed extensions are png/jpg/jpeg.", ResponseErrorCode.ERR_6))
		}

		try {
			// TODO
		} catch (e) {
			throw new BadRequestException(fail("Prediction failed.", ResponseErrorCode.ERR_7))
		}
	}
}

import { BadRequestException, Injectable } from "@nestjs/common";
import { PredictionResult } from "@prisma/client";
import * as tf from '@tensorflow/tfjs-node';
import { ResponseErrorCode, fail } from "src/utils";

@Injectable()
export class ModelService {
  private model: tf.LayersModel

  async predict(img: Uint8Array) {
    try {
      if (!this.model) {
        this.model = await tf.loadLayersModel(process.env.MODEL_PUBLIC_URL)
      }

      const tensor = tf.node
        .decodeJpeg(img)
        .resizeNearestNeighbor([160, 160])
        .expandDims()
        .toFloat()
        .div(tf.scalar(255.0))

      const prediction = this.model.predict(tensor) as tf.Tensor;
      const score = await prediction.data();
      const confidence = score[0];
      const result: PredictionResult = confidence > 0.5 ? "NORMAL" : "CATARACT";
      const confidenceRate = confidence > 0.5 ? confidence : 1 - confidence;

      return {
        result,
        confidence: confidenceRate
      }
    } catch (e) {
      throw new BadRequestException(fail("Prediction failed.", ResponseErrorCode.ERR_7))
    }
  }
}
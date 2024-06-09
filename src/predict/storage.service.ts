import { Storage } from "@google-cloud/storage";
import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

@Injectable()
export class StorageService {
  private storage: Storage;

  constructor() {
    const credentials = JSON.parse(process.env.GCS_CREDENTIALS)

    this.storage = new Storage({
      projectId: process.env.PROJECT_ID,
      credentials
    })
  }

  async uploadFile(file: Express.Multer.File, bucket: string, destination: string) {
    await this.storage.bucket(bucket).file(destination).save(file.buffer);

    const url = `https://storage.googleapis.com/${bucket}/${destination}`;
    return url;
  };

  async uploadImage(file: Express.Multer.File) {
    const uuid = randomUUID()
    return await this.uploadFile(file, process.env.GCS_BUCKET, `images/${uuid}-${file.originalname.replaceAll(' ', '_')}`)
  }
}
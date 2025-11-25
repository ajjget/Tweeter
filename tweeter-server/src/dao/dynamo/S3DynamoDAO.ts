import { randomUUID } from "crypto";
import { IS3DAO } from "../interfaces/IS3DAO";
import { S3Client, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";

export class S3DynamoDAO implements IS3DAO {
  private s3 = new S3Client({ region: "us-east-2" });
  private BUCKET_NAME = "ajjget-tweeter";
  
  public async uploadImage(userAlias: string, userImageBytes: string, imageFileExtension: string): Promise<string> {
    const fileName = `avatars/${userAlias}-${randomUUID()}.${imageFileExtension}`;
    const buffer = Buffer.from(userImageBytes, "base64");
    const acl: ObjectCannedACL = "public-read";

    const params = {
      Bucket: this.BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: `image/${imageFileExtension}`,
      ACL: acl
    };

    await this.s3.send(new PutObjectCommand(params));

    return `https://${this.BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
  }

  deleteImage(userAlias: string): Promise<void> {
    return Promise.resolve();
  }
}
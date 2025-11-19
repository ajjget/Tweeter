import { IS3DAO } from "../interfaces/IS3DAO";

export class S3DynamoDAO implements IS3DAO {
  uploadImage(userAlias: string, userImageBytes: string, imageFileExtension: string): Promise<string> {
    return Promise.resolve("");
  }

  deleteImage(userAlias: string): Promise<void> {
    return Promise.resolve();
  }
}
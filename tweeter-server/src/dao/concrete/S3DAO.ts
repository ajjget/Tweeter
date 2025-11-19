export class S3DAO {
  uploadImage(userAlias: string, userImageBytes: string, imageFileExtension: string): Promise<void> {
    return Promise.resolve();
  }

  deleteImage(userAlias: string): Promise<string> {
    return Promise.resolve("");
  }
}
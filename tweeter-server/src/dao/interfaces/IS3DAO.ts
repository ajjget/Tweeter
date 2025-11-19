export interface IS3DAO {
  uploadImage(userAlias: string, userImageBytes: string, imageFileExtension: string): Promise<string>;
  deleteImage(userAlias: string): Promise<void>; 
}
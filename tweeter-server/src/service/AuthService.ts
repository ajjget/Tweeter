import { AuthTokenDto, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import bcrypt = require("bcryptjs");

export class AuthService extends Service {

  public async login (
      alias: string,
      password: string
    ): Promise<[UserDto, AuthTokenDto]> {
      const internalUser = await this.userDAO.getInternalUserByAlias(alias);

      if (internalUser == null) {
        throw new Error("Unknown alias");
      }
      
      if (await bcrypt.compare(password, internalUser?.passwordHash)) {
        const userDto = internalUser.createUserDto();
        const authTokenDto = await this.authTokenDAO.create(userDto.alias);
        return [userDto, authTokenDto];
      }
      else {
        throw new Error("Invalid alias or password");
      }
    };

  public async register (
      firstName: string,
      lastName: string,
      alias: string,
      password: string,
      userImageBytes: string,
      imageFileExtension: string
    ): Promise<[UserDto, AuthTokenDto]> {
      const hashedPassword = await this.hashPassword(password);
      const imageUrl = await this.s3DAO.uploadImage(alias, userImageBytes, imageFileExtension);

      const userDto: UserDto = {
        firstName: firstName,
        lastName: lastName,
        alias: alias,
        imageUrl: imageUrl
      }
      await this.userDAO.create(userDto, hashedPassword);

      const authTokenDto = await this.authTokenDAO.create(userDto.alias);
      return [userDto, authTokenDto];
  };

  public async logout (authToken: string): Promise<void> {
    await this.authTokenDAO.delete(authToken);
  };

  private async hashPassword(plain: string): Promise<string> {
    const saltRounds = 10;
    const hash = await bcrypt.hash(plain, saltRounds);
    return hash;
  }
}
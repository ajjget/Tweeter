import { AuthTokenDto, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import bcrypt = require("bcryptjs");

export class AuthService extends Service {

  public async login (
      alias: string,
      password: string
    ): Promise<[UserDto, AuthTokenDto]> {
      const internalUser = await this.userDAO.getInternalUserByAlias(alias);
      const hashedPassword = await this.hashPassword(password);
      
      if (hashedPassword == internalUser?.passwordHash) {
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
      const internalUser = await this.userDAO.getUserByAlias(alias);
      
      if (internalUser === null) {
        const hashedPassword = await this.hashPassword(password);
        const imageUrl = await this.s3DAO.uploadImage(alias, userImageBytes, imageFileExtension);

        const userDto: UserDto = {
          firstName: firstName,
          lastName: lastName,
          alias: alias,
          imageUrl: imageUrl
        }
        this.userDAO.create(userDto, hashedPassword);

        const authTokenDto = await this.authTokenDAO.create(userDto.alias);
        return [userDto, authTokenDto];
      }
      else {
        throw new Error("Invalid registration. Try using a different alias.");
      }
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
import { FakeData, AuthTokenDto, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class AuthService implements Service {
  public async login (
      alias: string,
      password: string
    ): Promise<[UserDto, AuthTokenDto]> {
      // TODO: Replace with the result of calling the server
      const user = FakeData.instance.firstUser;
  
      if (user === null) {
        throw new Error("Invalid alias or password");
      }
  
      const userDto = user.dto;
      const authTokenDto = FakeData.instance.authToken.dto;
      return [userDto, authTokenDto];
    };

  public async register (
      firstName: string,
      lastName: string,
      alias: string,
      password: string,
      userImageBytes: string,
      imageFileExtension: string
    ): Promise<[UserDto, AuthTokenDto]> {
      // TODO: Replace with the result of calling the server
      const user = FakeData.instance.firstUser;
      
      if (user === null) {
        throw new Error("Invalid registration");
      }

      const userDto = user.dto;
      const authTokenDto = FakeData.instance.authToken.dto;
      return [userDto, authTokenDto];
    };

  public async logout (authToken: string): Promise<void> {
    await new Promise((res) => setTimeout(res, 1000));
  };
}
import { Buffer } from "buffer";
import { AuthToken, LoginRequest, LogoutRequest, RegisterRequest, User } from "tweeter-shared";
import { Service } from "./Service";

export class AuthService extends Service {
  public async login (
      alias: string,
      password: string
    ): Promise<[User, AuthToken]> {
    const request: LoginRequest = {
      alias: alias,
      password: password
    };

    return await this.serverFacade.login(request);
  };

  public async register (
      firstName: string,
      lastName: string,
      alias: string,
      password: string,
      userImageBytes: Uint8Array,
      imageFileExtension: string
    ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const request: RegisterRequest = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      userImageBytes: imageStringBase64,
      imageFileExtension: imageFileExtension
    }

    return await this.serverFacade.register(request);
  };

  public async logout (authToken: AuthToken): Promise<void> {
    const request: LogoutRequest = {
      token: authToken.token
    }

    await this.serverFacade.logout(request);
  };
}
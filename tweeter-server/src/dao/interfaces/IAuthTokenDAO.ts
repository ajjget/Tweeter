import { AuthTokenDto } from "tweeter-shared";

export interface IAuthTokenDAO {
  create(userAlias: string): Promise<AuthTokenDto>;
  delete(token: string): Promise<void>;
  getToken(token: string): Promise<AuthTokenDto | null>;
}
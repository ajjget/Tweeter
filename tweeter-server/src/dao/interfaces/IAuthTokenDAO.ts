import { AuthTokenDto } from "tweeter-shared";

export interface IAuthTokenDAO {
  create(userAlias: string): Promise<AuthTokenDto>;
  delete(token: string): Promise<void>;
  authorize(token: string): Promise<boolean>;
}
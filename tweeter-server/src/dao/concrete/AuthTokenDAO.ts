import { AuthTokenDto } from "tweeter-shared";

export class AuthTokenDAO {
  create(userAlias: string): Promise<AuthTokenDto> {
    return Promise.resolve({ token: "1", timestamp: 1 });
  }

  delete(token: string): Promise<void> {
    return Promise.resolve();
  }

  // TODO: if auth token is old, log user out and delete from DB
  authorize(token: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}
import { UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class FollowService extends Service {
  
  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authorize(token);
    return await this.userDAO.getFollowees(userAlias, pageSize, lastItem);
  };

  public async loadMoreFollowers (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
    await this.authorize(token);
    return await this.userDAO.getFollowers(userAlias, pageSize, lastItem);
  };
}
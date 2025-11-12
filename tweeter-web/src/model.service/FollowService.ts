import { AuthToken, User, PagedUserItemRequest } from "tweeter-shared";
import { Service } from "./Service";

export class FollowService extends Service {
  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
        token: authToken.token,
        userAlias: userAlias,
        pageSize: pageSize,
        lastItem: lastItem === null ? null : lastItem.dto
      };

      return await this.serverFacade.getMoreFollowees(request);
  };

  public async loadMoreFollowers (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
    ): Promise<[User[], boolean]> {
      const request: PagedUserItemRequest = {
        token: authToken.token,
        userAlias: userAlias,
        pageSize: pageSize,
        lastItem: lastItem === null ? null : lastItem.dto
      };

      return await this.serverFacade.getMoreFollowers(request);
    }; 
}
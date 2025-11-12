import { AuthToken, Status, PagedStatusItemRequest, PostStatusRequest } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService extends Service {
  public async loadMoreFeedItems (
      authToken: AuthToken,
      userAlias: string,
      pageSize: number,
      lastItem: Status | null
    ): Promise<[Status[], boolean]> {
      const request: PagedStatusItemRequest = {
        token: authToken.token,
        userAlias: userAlias,
        pageSize: pageSize,
        lastItem: lastItem === null ? null : lastItem.dto
      }

      return await this.serverFacade.getMoreFeedItems(request);
    };

  public async loadMoreStoryItems (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
    ): Promise<[Status[], boolean]> {
      const request: PagedStatusItemRequest = {
        token: authToken.token,
        userAlias: userAlias,
        pageSize: pageSize,
        lastItem: lastItem === null ? null : lastItem.dto
      }

      return await this.serverFacade.getMoreStoryItems(request);
    };

  public async postStatus (
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    const request: PostStatusRequest = {
      token: authToken.token,
      status: newStatus.dto
    }

    await this.serverFacade.postStatus(request);
  };
}
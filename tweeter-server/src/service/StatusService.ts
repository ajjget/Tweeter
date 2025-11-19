import { StatusDto } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService extends Service {

  public async loadMoreFeedItems (
      authToken: string,
      userAlias: string,
      pageSize: number,
      lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
      await this.authorize(authToken);
      return this.statusDAO.getFeedItems(userAlias, pageSize, lastItem);
  };

  public async loadMoreStoryItems (
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
      await this.authorize(authToken);
      return this.statusDAO.getStoryItems(userAlias, pageSize, lastItem);
  };

  public async postStatus (
    authToken: string,
    newStatus: StatusDto
  ): Promise<void> {
    await this.authorize(authToken);
    await this.statusDAO.postStatus(newStatus);
  };
}
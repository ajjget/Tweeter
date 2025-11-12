import { AuthToken, Status, FakeData, StatusDto } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService implements Service {
  public async loadMoreFeedItems (
      authToken: string,
      userAlias: string,
      pageSize: number,
      lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
      return this.getFakeData(lastItem, pageSize);
    };

  public async loadMoreStoryItems (
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
      return this.getFakeData(lastItem, pageSize);
    };

  private async getFakeData(lastItem: StatusDto | null, pageSize: number): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
    const dtos = items.map((status) => status.dto);
    return [dtos, hasMore];
  }

  public async postStatus (
    authToken: string,
    newStatus: StatusDto
  ): Promise<void> {
    await new Promise((f) => setTimeout(f, 2000));
  };
}
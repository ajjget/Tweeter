import { StatusDto } from "tweeter-shared";
import { IStatusDAO } from "../interfaces/IStatusDAO";

export class StatusDynamoDAO implements IStatusDAO {
  getStoryItems(
    userAlias: string, 
    pageSize: number, 
    lastItem: StatusDto | null)
    : Promise<[StatusDto[], boolean]> {
      return Promise.resolve([[], true]);
  }

  getFeedItems(
    userAlias: string, 
    pageSize: number, 
    lastItem: StatusDto | null)
    : Promise<[StatusDto[], boolean]> {
      return Promise.resolve([[], true]);
  }

  postStatus(newStatus: StatusDto): Promise<void> {
    return Promise.resolve();
  }
}
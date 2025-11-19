import { StatusDto } from "tweeter-shared";

export interface IStatusDAO {
  getStoryItems(userAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>;
  getFeedItems(userAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>;

  postStatus(newStatus: StatusDto): Promise<void>;
}
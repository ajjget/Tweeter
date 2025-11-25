import { StatusDto } from "tweeter-shared";
import { IStatusDAO } from "../interfaces/IStatusDAO";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class StatusDynamoDAO implements IStatusDAO {
  private client = new DynamoDBClient({ region: "us-east-2"});
  private docClient = DynamoDBDocumentClient.from(this.client);

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

  public async postStatus(newStatus: StatusDto): Promise<void> {
    const params = {
      TableName: "statuses",
      Item: {
        alias: newStatus.user,
        timestamp: newStatus.timestamp,
        post: newStatus.post
      }
    }

    await this.docClient.send(new PutCommand(params));
  }
}
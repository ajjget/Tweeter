import { StatusDto, UserDto } from "tweeter-shared";
import { IStatusDAO } from "../interfaces/IStatusDAO";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserDynamoDAO } from "./UserDynamoDAO";

export class StatusDynamoDAO implements IStatusDAO {
  private client = new DynamoDBClient({ region: "us-east-2"});
  private docClient = DynamoDBDocumentClient.from(this.client);
  private userDynamoDAO = new UserDynamoDAO();

  // the user's own posts
  public async getStoryItems(
    alias: string, 
    limit: number, 
    lastItem: StatusDto | null)
    : Promise<[StatusDto[], boolean]> {
    const params = {
      KeyConditionExpression: "alias = :alias",
      ExpressionAttributeValues: {
        ":alias": alias
      },
      TableName: "statuses",
      Limit: limit,
      ExclusiveStartKey: lastItem === null 
        ? undefined 
        : 
        { 
          alias: lastItem?.user.alias, 
          timestamp: lastItem?.timestamp 
        },
      ScanIndexForward: false
    };

    const result = await this.docClient.send(new QueryCommand(params));
    
    return await this.parseStatusResult(result);
  }

  // statuses from those the user follows
  public async getFeedItems(
    alias: string, 
    limit: number, 
    lastItem: StatusDto | null)
    : Promise<[StatusDto[], boolean]> {
    const params = {
      KeyConditionExpression: "followee = :followee",
      ExpressionAttributeValues: {
        ":followee": alias
      },
      TableName: "feed",
      Limit: limit,
      ExclusiveStartKey: lastItem === null 
        ? undefined 
        : 
        { 
          followee: alias, 
          timestamp: lastItem?.timestamp 
        },
      ScanIndexForward: false
    };

    const result = await this.docClient.send(new QueryCommand(params));
    
    return await this.parseStatusResult(result);
  }

  private async parseStatusResult(result: QueryCommandOutput): Promise<[StatusDto[], boolean]> {
    const items = result.Items ?? [];
    const statuses = await Promise.all(
      items.map(async item => ({
        post: item.post,
        user: (await this.userDynamoDAO.getUserByAlias(item.alias))!,
        timestamp: item.timestamp
        })
      )
    );

    const hasMore = !!result.LastEvaluatedKey;

    return [statuses, hasMore];
  }

  public async postStatus(newStatus: StatusDto): Promise<void> {
    await this.postToStatuses(newStatus);
    await this.postForFollowees(newStatus);
  }

  private async postToStatuses(newStatus: StatusDto): Promise<void> {
    const params = {
      TableName: "statuses",
      Item: {
        alias: newStatus.user.alias,
        timestamp: newStatus.timestamp,
        post: newStatus.post
      }
    }

    await this.docClient.send(new PutCommand(params));
  }

  private async postForFollowees(newStatus: StatusDto): Promise<void> {
    let hasMore = true;
    let lastItem: UserDto | null = null;
    
    while (hasMore) {
      const [followees, stillMoreUsers] = await this.userDynamoDAO.getFollowees(newStatus.user.alias, 100, lastItem);
      lastItem = followees.length > 0 ? followees[followees.length - 1] : null;
      hasMore = stillMoreUsers;

      // this Promise.all will send out the requests synchronously, but wait for them all to return before continuing
      await Promise.all(
        followees.map(follower =>
          this.postToFeed(follower.alias, newStatus)
        )
      );
    }
  }

  private async postToFeed(alias: string, newStatus: StatusDto): Promise<void> {
    const params = {
      TableName: "feed",
      Item: {
        followee: alias,
        timestamp: newStatus.timestamp,
        post: newStatus.post,
        alias: newStatus.user.alias
      }
    }

    await this.docClient.send(new PutCommand(params));
  }
}
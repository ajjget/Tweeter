import { UserDto } from "tweeter-shared";
import { InternalUser } from "../models/InternalUser";
import { IUserDAO } from "../interfaces/IUserDAO";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, QueryCommandOutput, DynamoDBDocumentClient, GetCommand, GetCommandOutput, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export class UserDynamoDAO implements IUserDAO {
  private client = new DynamoDBClient({ region: "us-east-2"});
  private docClient = DynamoDBDocumentClient.from(this.client);

  public async create(user: UserDto, passwordHash: string): Promise<UserDto> {
    const params = {
      TableName: "users",
      Item: {
        alias: user.alias,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        password: passwordHash,
        followerCount: 0,
        followeeCount: 0
      },
      ConditionExpression: "attribute_not_exists(alias)",
    };

    try {
      await this.docClient.send(new PutCommand(params));
    }
    catch (err) {
      if (err instanceof Error) {
        if (err.name === "ConditionalCheckFailedException") {
          throw new Error("User already exists");
        }
        throw err;
      }
    }
    
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      alias: user.alias,
      imageUrl: user.imageUrl
    };
  }

  public async getUserByAlias(alias: string): Promise<UserDto | null> {
    const user = await this.getUserFromUsers(alias);

    if (!user.Item) {
      return null;
    }

    return {
      alias: user.Item.alias,
      firstName: user.Item.firstName,
      lastName: user.Item.lastName,
      imageUrl: user.Item.imageUrl
    }
  }

  public async getInternalUserByAlias(alias: string): Promise<InternalUser | null> {
    const user = await this.getUserFromUsers(alias);

    if (!user.Item) {
      return null;
    }

    return new InternalUser(
      user.Item.alias,
      user.Item.firstName,
      user.Item.lastName,
      user.Item.imageUrl,
      user.Item.password
    );
  }

  public async getFollowees(alias: string, limit: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]> {
    return await this.getFollowUsers(alias, limit, lastItem, false);
  }

  public async getFollowers(alias: string, limit: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]> {
    return await this.getFollowUsers(alias, limit, lastItem, true);
  }

  private async getFollowUsers(alias: string, limit: number, lastItem: UserDto | null, getFollowers: boolean): Promise<[UserDto[], boolean]> { 
    const followType = getFollowers ? "follower" : "followee";
    const params = { 
      TableName: "followRelationships", 
      KeyConditionExpression: `${followType} = :alias`, 
      ExpressionAttributeValues: { ":alias": alias }, 
      Limit: limit, 
      IndexName: getFollowers ? undefined : "followeeSort", 
      ExclusiveStartKey: lastItem === null 
        ? undefined 
        : getFollowers 
        ? { followee: lastItem.alias, follower: alias } 
        : { followee: alias, follower: lastItem.alias } 
    };

    const result = await this.docClient.send(new QueryCommand(params));
    const users = await this.mapUserItems(result, getFollowers);
    const hasMore = !!result.LastEvaluatedKey;

    return [users, hasMore];
  }

  private async mapUserItems(result: QueryCommandOutput, getFollowers: boolean): Promise<UserDto[]> {
    const items = result.Items ?? [];
    const users = await Promise.all(
      items.map(async item => {
          const userToGet = getFollowers ? item.followee : item.follower;
          const user = await this.getUserByAlias(userToGet);

          if (user === null) {
            throw new Error("There was a null user in mapUserItems");
          }
          return user;
        }
      ));
    return users;
  }

  public async followUser(followerAlias: string, followeeAlias: string): Promise<void> {
    const params = {
      TableName: "followRelationships",
      Item: {
        follower: followerAlias,
        followee: followeeAlias
      },
      ConditionExpression: "attribute_not_exists(follower) AND attribute_not_exists(followee)",
    };

    await this.docClient.send(new PutCommand(params));
    await this.updateFollowCounts(followerAlias, followeeAlias, true);
  }

  public async unfollowUser(followerAlias: string, followeeAlias: string): Promise<void> {
    const params = {
      TableName: "followRelationships",
      Key: { 
        follower: followerAlias,
        followee: followeeAlias
      }
    };

    await this.docClient.send(new DeleteCommand(params));
    await this.updateFollowCounts(followerAlias, followeeAlias, false);
  }

  private async updateFollowCounts(followerAlias: string, followeeAlias: string, increment: boolean): Promise<void> {
    await this.updateFollowCount(followerAlias, "follower", increment);
    await this.updateFollowCount(followeeAlias, "followee", increment);
  }

  private async updateFollowCount(alias: string, followType: string, increment: boolean): Promise<void> {
    const incrementAmount = increment ? 1 : -1;
    const operation = increment ? "inc" : "dec";
    const params = {
      TableName: "users",
      Key: { alias: alias },
      UpdateExpression: `ADD ${followType}Count :${operation}`,
      ExpressionAttributeValues: {
        [`:${operation}`]: incrementAmount
      },
      ConditionExpression: "attribute_exists(alias)"
    };

    await this.docClient.send(new UpdateCommand(params));
  }

  public async getFollowerCount(alias: string): Promise<number> {
    const user = await this.getUserFromUsers(alias);

    if (!user.Item) {
      throw new Error(`Could not retrieve follower count because no user with alias ${alias} was found.`);
    }

    return user.Item.followerCount;
  }

  public async getFolloweeCount(alias: string): Promise<number> {
    const user = await this.getUserFromUsers(alias);

    if (!user.Item) {
      throw new Error(`Could not retrieve followee count because no user with alias ${alias} was found.`);
    }

    return user.Item.followeeCount;
  }

  public async isFollower(followerAlias: string, followeeAlias: string): Promise<boolean> {
    const params = {
      TableName: "followRelationships",
      Key: {
        follower: followerAlias,
        followee: followeeAlias
      }
    };

    const result = await this.docClient.send(new GetCommand(params));
    
    return !!result.Item;
  }

  private async getUserFromUsers(alias: string): Promise<GetCommandOutput> {
    const params = {
      TableName: "users",
      Key: {
        alias: alias
      }
    };

    return await this.docClient.send(new GetCommand(params));
  }
}
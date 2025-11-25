import { User, UserDto } from "tweeter-shared";
import { InternalUser } from "../models/InternalUser";
import { IUserDAO } from "../interfaces/IUserDAO";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, GetCommandOutput, PutCommand } from "@aws-sdk/lib-dynamodb";

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

  private async getUserFromUsers(alias: string): Promise<GetCommandOutput> {
    const params = {
      TableName: "users",
      Key: {
        alias: alias
      }
    };

    return await this.docClient.send(new GetCommand(params));
  }

  getFollowers(alias: string, limit: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]> {
    return Promise.resolve([[], true]);
  }

  getFollowees(alias: string, limit: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]> {
    return Promise.resolve([[], true]);
  }

  followUser(followerAlias: string, followeeAlias: string): Promise<void> {
    return Promise.resolve();
  }

  unfollowUser(followerAlias: string, followeeAlias: string): Promise<void> {
    return Promise.resolve();
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

  isFollower(followerAlias: string, followeeAlias: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}
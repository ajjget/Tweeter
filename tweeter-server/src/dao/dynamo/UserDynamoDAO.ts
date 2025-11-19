import { UserDto } from "tweeter-shared";
import { InternalUser } from "../models/InternalUser";
import { IUserDAO } from "../interfaces/IUserDAO";

export class UserDynamoDAO implements IUserDAO {
  create(user: UserDto, passwordHash: string): Promise<UserDto> {
    return Promise.resolve({
      firstName: "",
      lastName: "",
      alias: "",
      imageUrl: ""
    });
  }

  getUserByAlias(alias: string): Promise<UserDto | null> {
    return Promise.resolve(null);
  }

  getInternalUserByAlias(alias: string): Promise<InternalUser | null> {
    return Promise.resolve(null);
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

  getFollowerCount(alias: string): Promise<number> {
    return Promise.resolve(1);
  }

  getFolloweeCount(alias: string): Promise<number> {
    return Promise.resolve(1);
  }

  isFollower(followerAlias: string, followeeAlias: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}
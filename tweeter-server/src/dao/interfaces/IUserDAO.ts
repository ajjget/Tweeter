import { UserDto } from "tweeter-shared";
import { InternalUser } from "../models/InternalUser";

export interface IUserDAO {
  create(user: UserDto, passwordHash: string): Promise<UserDto>;
  getUserByAlias(alias: string): Promise<UserDto | null>;
  getInternalUserByAlias(alias: string): Promise<InternalUser | null>;

  getFollowers(alias: string, limit: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]>;

  getFollowees(alias: string, limit: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]>;

  followUser(followerAlias: string, followeeAlias: string): Promise<void>;
  unfollowUser(followerAlias: string, followeeAlias: string): Promise<void>;

  getFollowerCount(alias: string): Promise<number>;
  getFolloweeCount(alias: string): Promise<number>;
  isFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;
}
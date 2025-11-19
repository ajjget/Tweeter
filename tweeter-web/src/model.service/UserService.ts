import { AuthToken, User, GetUserRequest, FollowActionRequest, FollowCountRequest } from "tweeter-shared";
import { Service } from "./Service";

export class UserService extends Service {
  public async getUser (
      authToken: AuthToken,
      alias: string
    ): Promise<User | null> {
    const request: GetUserRequest = {
      token: authToken.token,
      alias: alias
    }

    return await this.serverFacade.getUser(request);
  };

  public async follow (
    authToken: AuthToken,
    follower: User,
    followee: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: FollowActionRequest = {
      token: authToken.token,
      followerAlias: follower.alias,
      followeeAlias: followee.alias
    }

    return await this.serverFacade.follow(request);
  };

  public async unfollow (
    authToken: AuthToken,
    follower: User,
    followee: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: FollowActionRequest = {
      token: authToken.token,
      followerAlias: follower.alias,
      followeeAlias: followee.alias
    }

    return await this.serverFacade.unfollow(request);
  };

  public async getFolloweeCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: FollowCountRequest = {
      token: authToken.token,
      userAlias: user.alias
    }

    return await this.serverFacade.getFolloweeCount(request);
  };

  public async getFollowerCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: FollowCountRequest = {
      token: authToken.token,
      userAlias: user.alias
    }

    return await this.serverFacade.getFollowerCount(request);
  };

  public async getIsFollowerStatus (
    authToken: AuthToken,
    follower: User,
    followee: User
  ): Promise<boolean> {
    const request: FollowActionRequest = {
      token: authToken.token,
      followerAlias: follower.alias,
      followeeAlias: followee.alias
    }

    return await this.serverFacade.getIsFollowerStatus(request);
  };
}
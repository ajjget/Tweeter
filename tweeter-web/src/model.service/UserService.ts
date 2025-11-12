import { AuthToken, User, GetUserRequest, FollowActionRequest, GetIsFollowerStatusRequest } from "tweeter-shared";
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
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: FollowActionRequest = {
      token: authToken.token,
      targetUser: userToFollow.dto
    }

    return await this.serverFacade.follow(request);
  };

  public async unfollow (
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: FollowActionRequest = {
      token: authToken.token,
      targetUser: userToUnfollow.dto
    }

    return await this.serverFacade.unfollow(request);
  };

  public async getFolloweeCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: FollowActionRequest = {
      token: authToken.token,
      targetUser: user.dto
    }

    return await this.serverFacade.getFolloweeCount(request);
  };

  public async getFollowerCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: FollowActionRequest = {
      token: authToken.token,
      targetUser: user.dto
    }

    return await this.serverFacade.getFollowerCount(request);
  };

  public async getIsFollowerStatus (
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const request: GetIsFollowerStatusRequest = {
      token: authToken.token,
      targetUser: user.dto,
      user: selectedUser.dto
    }

    return await this.serverFacade.getIsFollowerStatus(request);
  };
}
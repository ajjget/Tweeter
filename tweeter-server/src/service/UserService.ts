import { UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class UserService extends Service {
  public async getUser (
      token: string,
      alias: string
    ): Promise<UserDto | null> {
    await this.authorize(token);
    return await this.userDAO.getUserByAlias(alias);
  };

  public async follow (
    token: string,
    followerAlias: string,
    followeeAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.authorize(token);
    await this.userDAO.followUser(followerAlias, followeeAlias);

    return await this.getFolloweeAndFollowerCounts(token, followeeAlias);
  };

  public async unfollow (
    token: string,
    followerAlias: string,
    followeeAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.authorize(token);
    await this.userDAO.unfollowUser(followerAlias, followeeAlias);

    return await this.getFolloweeAndFollowerCounts(token, followeeAlias);
  };

  private async getFolloweeAndFollowerCounts(token: string, userAlias: string): Promise<[number, number]> {
    const followerCount = await this.getFollowerCount(token, userAlias);
    const followeeCount = await this.getFolloweeCount(token, userAlias);

    return [followerCount, followeeCount];
  }

  public async getFolloweeCount (
    token: string,
    userAlias: string
  ): Promise<number> {
    await this.authorize(token);
    return await this.userDAO.getFolloweeCount(userAlias);
  };

  public async getFollowerCount (
    authToken: string,
    userAlias: string
  ): Promise<number> {
    await this.authorize(authToken);
    return await this.userDAO.getFollowerCount(userAlias);
  };

  public async getIsFollowerStatus (
    token: string,
    followerAlias: string,
    followeeAlias: string
  ): Promise<boolean> {
    await this.authorize(token);
    return await this.userDAO.isFollower(followerAlias, followeeAlias);
  };
}
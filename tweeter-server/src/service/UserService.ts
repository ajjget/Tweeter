import { UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class UserService extends Service {
  public async getUser (
      token: string,
      alias: string
    ): Promise<UserDto | null> {
    await this.authorize(token);
    let cleanedAlias = alias.startsWith('@') ? alias.slice(1) : alias;
    cleanedAlias = alias.includes("/") ? alias.split("/").pop() ?? "" : cleanedAlias;
    return await this.userDAO.getUserByAlias(cleanedAlias);
  };

  public async follow (
    token: string,
    followerAlias: string,
    followeeAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.authorize(token);
    await this.userDAO.followUser(followerAlias, followeeAlias);

    return await this.getFolloweeAndFollowerCounts(followeeAlias);
  };

  public async unfollow (
    token: string,
    followerAlias: string,
    followeeAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.authorize(token);
    await this.userDAO.unfollowUser(followerAlias, followeeAlias);

    return await this.getFolloweeAndFollowerCounts(followeeAlias);
  };

  // if you're using this function, you've already authenticated
  private async getFolloweeAndFollowerCounts(userAlias: string): Promise<[number, number]> {
    const followerCount = await this.userDAO.getFollowerCount(userAlias);
    const followeeCount = await this.userDAO.getFolloweeCount(userAlias);

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
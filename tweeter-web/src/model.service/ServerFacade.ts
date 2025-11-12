import {
  AuthToken,
  User,
  PagedUserItemRequest,
  LoginRequest,
  PagedUserItemResponse,
  AuthResponse,
  RegisterRequest,
  LogoutRequest,
  TweeterResponse,
  PagedStatusItemRequest,
  Status,
  PagedStatusItemResponse,
  PostStatusRequest,
  GetUserRequest,
  GetUserResponse,
  FollowActionRequest,
  SetFollowStatusResponse,
  GetFollowCountResponse,
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://okx3z0600e.execute-api.us-east-2.amazonaws.com/prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  // followees and followers loaders can be combined with generics
  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followee/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follower/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followers found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }


  // login and register can be combined with generics
  public async login(
    request: LoginRequest
  ): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      AuthResponse
    >(request, "/auth/login");

    const user: User | null =
      response.success && response.user
        ? User.fromDto(response.user) : null;

    const authToken : AuthToken | null =
      response.success && response.authToken
        ? AuthToken.fromDto(response.authToken) : null;

    if (response.success) {
      if (user == null) {
        throw new Error(`No user found`);
      } else if (authToken == null) {
        throw new Error(`No auth token retrieved`);
      } else {
        return [user, authToken];
      }
    }
    else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async register(
    request: RegisterRequest
  ): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      AuthResponse
    >(request, "/auth/register");

    const user: User | null =
      response.success && response.user
        ? User.fromDto(response.user) : null;

    const authToken : AuthToken | null =
      response.success && response.authToken
        ? AuthToken.fromDto(response.authToken) : null;

    if (response.success) {
      if (user == null) {
        throw new Error(`No user found`);
      } else if (authToken == null) {
        throw new Error(`No auth token retrieved`);
      } else {
        return [user, authToken];
      }
    }
    else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async logout(
    request: LogoutRequest
  ): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      TweeterResponse
    >(request, "/auth/logout");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getMoreFeedItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/feed/list");

    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    if (response.success) {
      if (items == null) {
        throw new Error(`No feed items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getMoreStoryItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/story/list");

    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    if (response.success) {
      if (items == null) {
        throw new Error(`No story items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async postStatus(
    request: PostStatusRequest
  ): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      TweeterResponse
    >(request, "/status");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getUser(
    request: GetUserRequest
  ): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/user");

    const user: User | null =
      response.success && response.user
        ? User.fromDto(response.user)
        : null;

    if (response.success) {
      if (user == null) {
        throw new Error(`No user found`);
      } else {
        return user;
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async follow(
    request: FollowActionRequest
  ): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      FollowActionRequest,
      SetFollowStatusResponse
    >(request, "/follow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async unfollow(
    request: FollowActionRequest
  ): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      FollowActionRequest,
      SetFollowStatusResponse
    >(request, "/unfollow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getFolloweeCount(
    request: FollowActionRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      FollowActionRequest,
      GetFollowCountResponse
    >(request, "/followee/count");

    if (response.success) {
      return response.followCount;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getFollowerCount(
    request: FollowActionRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      FollowActionRequest,
      GetFollowCountResponse
    >(request, "/follower/count");

    if (response.success) {
      return response.followCount;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getIsFollowerStatus(
    request: GetIsFollowerStatusRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      GetIsFollowerStatusRequest,
      GetIsFollowerStatusResponse
    >(request, "/follower/status");

    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

}
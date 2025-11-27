import { FollowActionRequest, SetFollowStatusResponse } from "tweeter-shared";
import { services } from "../Lambda";

export const handler = async (request: FollowActionRequest): Promise<SetFollowStatusResponse> => {
  try {
    const [followerCount, followeeCount] = await services.userService.follow(
      request.token, 
      request.followerAlias,
      request.followeeAlias
    );

    return {
      success: true,
      message: null,
      followerCount: followerCount,
      followeeCount: followeeCount
    }
  }
  catch (error) {
    return {
      success: false,
      message: (error as Error).message ?? "Unknown error",
      followerCount: 0,
      followeeCount: 0
    }
  }
}
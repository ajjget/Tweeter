import { FollowCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { services } from "../Lambda";

export const handler = async (request: FollowCountRequest): Promise<GetFollowCountResponse> => {
  try {
    const followCount = await services.userService.getFollowerCount(
      request.token, 
      request.userAlias
    );

    return {
      success: true,
      message: null,
      followCount: followCount
    }
  }
  catch (error) {
    return {
      success: false,
      message: (error as Error).message ?? "Unknown error",
      followCount: 0
    }
  }
}
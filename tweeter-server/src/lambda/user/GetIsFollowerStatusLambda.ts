import { FollowActionRequest, GetIsFollowerStatusResponse } from "tweeter-shared";
import { services } from "../Lambda";

export const handler = async (request: FollowActionRequest): Promise<GetIsFollowerStatusResponse> => {
  try {
    const isFollower = await services.userService.getIsFollowerStatus(
      request.token, 
      request.followerAlias,
      request.followeeAlias
    );

    return {
      success: true,
      message: null,
      isFollower: isFollower
    }
  }
  catch (error) {
    return {
      success: false,
      message: (error as Error).message ?? "Unknown error",
      isFollower: false
    }
  }
}
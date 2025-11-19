import { FollowActionRequest, SetFollowStatusResponse } from "tweeter-shared";
import { services } from "../Lambda";

export const handler = async (request: FollowActionRequest): Promise<SetFollowStatusResponse> => {
  const [followerCount, followeeCount] = await services.userService.unfollow(
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
import { FollowCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { services } from "../Lambda";

export const handler = async (request: FollowCountRequest): Promise<GetFollowCountResponse> => {
  const followCount = await services.userService.getFolloweeCount(
    request.token, 
    request.userAlias
  );

  return {
    success: true,
    message: null,
    followCount: followCount
  }
}
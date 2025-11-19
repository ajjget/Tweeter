import { FollowCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { UserService } from "../../service/UserService";

export const handler = async (request: FollowCountRequest): Promise<GetFollowCountResponse> => {
  const userService = new UserService();
  const followCount = await userService.getFolloweeCount(
    request.token, 
    request.userAlias
  );

  return {
    success: true,
    message: null,
    followCount: followCount
  }
}
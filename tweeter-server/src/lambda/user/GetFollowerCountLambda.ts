import { FollowActionRequest, GetFollowCountResponse } from "tweeter-shared";
import { UserService } from "../../service/UserService";

export const handler = async (request: FollowActionRequest): Promise<GetFollowCountResponse> => {
  const userService = new UserService();
  const followCount = await userService.getFollowerCount(
    request.token, 
    request.targetUser
  );

  return {
    success: true,
    message: null,
    followCount: followCount
  }
}
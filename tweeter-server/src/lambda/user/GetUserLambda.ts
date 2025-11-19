import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { services } from "../Lambda";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
  const user = await services.userService.getUser(
    request.token, 
    request.alias,
  );

  return {
    success: true,
    message: null,
    user: user
  }
}
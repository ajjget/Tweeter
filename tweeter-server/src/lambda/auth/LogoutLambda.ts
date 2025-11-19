import { services } from "../Lambda"
import { LogoutRequest, TweeterResponse } from "tweeter-shared";

export const handler = async (request: LogoutRequest): Promise<TweeterResponse> => {
  await services.authService.logout(
    request.token
  );

  return {
    success: true,
    message: null
  }
}
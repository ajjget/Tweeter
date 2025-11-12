import { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { AuthService } from "../../service/AuthService"

export const handler = async (request: LogoutRequest): Promise<TweeterResponse> => {
  const authService = new AuthService();
  await authService.logout(
    request.token
  );

  return {
    success: true,
    message: null
  }
}
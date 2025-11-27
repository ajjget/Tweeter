import { services } from "../Lambda"
import { LogoutRequest, TweeterResponse } from "tweeter-shared";

export const handler = async (request: LogoutRequest): Promise<TweeterResponse> => {
  try {
    await services.authService.logout(
      request.token
    );

    return {
      success: true,
      message: null
    }
  }
  catch (error) {
    return {
      success: false,
      message: (error as Error).message ?? "Unknown error",
    }
  }
}
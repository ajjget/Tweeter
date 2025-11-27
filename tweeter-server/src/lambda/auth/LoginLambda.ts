import { services } from "../Lambda"
import { AuthResponse, LoginRequest } from "tweeter-shared";

export const handler = async (request: LoginRequest): Promise<AuthResponse> => {
  try {
    const [user, authToken] = await services.authService.login(
      request.alias,
      request.password
    );

    return {
      success: true,
      message: null,
      user: user,
      authToken: authToken
    }
  }
  catch (error) {
    return {
      success: false,
      message: (error as Error).message ?? "Unknown error",
      user: null,
      authToken: null
    }
  }
}
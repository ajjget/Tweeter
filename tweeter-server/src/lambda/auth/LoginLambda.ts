import { services } from "../Lambda"
import { AuthResponse, LoginRequest } from "tweeter-shared";

export const handler = async (request: LoginRequest): Promise<AuthResponse> => {
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
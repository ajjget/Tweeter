import { AuthResponse, LoginRequest } from "tweeter-shared";
import { AuthService } from "../../service/AuthService"

export const handler = async (request: LoginRequest): Promise<AuthResponse> => {
  const authService = new AuthService();
  const [user, authToken] = await authService.login(
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
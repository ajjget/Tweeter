import { AuthResponse, RegisterRequest } from "tweeter-shared";
import { services } from "../Lambda"

export const handler = async (request: RegisterRequest): Promise<AuthResponse> => {
  const [user, authToken] = await services.authService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension
  );

  return {
    success: true,
    message: null,
    user: user,
    authToken: authToken
  }
}
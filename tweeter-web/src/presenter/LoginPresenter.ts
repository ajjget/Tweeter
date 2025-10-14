import { User, AuthToken } from "tweeter-shared";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter<AuthView> {

  protected itemDescription(): string {
    return "log user in";
  }
  
  protected authenticate(alias: string, password: string): Promise<[User, AuthToken]> {
    return this.service.login(alias, password)
  }
}
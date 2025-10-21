import { User, AuthToken } from "tweeter-shared";
import { View, Presenter } from "../Presenter";
import { AuthService } from "../../model.service/AuthService";

export interface AuthView extends View {
  navigateTo: (url: string) => void;
  updateUserInfo: (currentUser: User, displayedUser: User, authToken: AuthToken, rememberMe: boolean) => void;
}

export abstract class AuthPresenter<V extends AuthView> extends Presenter<V> {
  protected service: AuthService;

  public constructor(view: V) {
    super(view);
    this.service = new AuthService();
  }

  public async doAuthenticationOperation(
    alias: string,
    password: string, 
    rememberMe: boolean, 
    originalUrl?: string) {
    await this.doFailureReportingOperation(async () => {
      const [user, authToken] = await this.authenticate(alias, password);

      this._view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this._view.navigateTo(originalUrl);
      } else {
        this._view.navigateTo(`/feed/${user.alias}`);
      }
    }, this.itemDescription());
  }

  protected abstract itemDescription(): string;

  protected abstract authenticate(alias: string, password: string): Promise<[User, AuthToken]>;
}

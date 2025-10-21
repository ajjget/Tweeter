import { AuthToken } from "tweeter-shared";
import { AuthService } from "../../model.service/AuthService";
import { MessageView, Presenter } from "../Presenter";

export interface LogoutView extends MessageView {
  navigateTo: (url: string) => void;
  clearUserInfo: () => void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
  private _authService: AuthService;

  public constructor(view: LogoutView) {
    super(view);
    this._authService = new AuthService();
  }

  public get authService() {
    return this._authService;
  }

  public async logOut (authToken: AuthToken) {
    await this.doFailureReportingOperation(async () => {
      const loggingOutToastId = this._view.displayInfoMessage("Logging Out...", 0);
      await this.authService.logout(authToken);

      this._view.deleteMessage(loggingOutToastId);
      this._view.clearUserInfo();
      this._view.navigateTo("/login");
    }, "log user out");
  };
}
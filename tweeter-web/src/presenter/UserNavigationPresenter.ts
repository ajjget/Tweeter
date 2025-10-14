import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
  displayErrorMessage: (message: string) => void;
  setDisplayedUser: (user: User) => void;
  navigateTo: (url: string) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private userService: UserService;

  public constructor(view: UserNavigationView) {
    super(view);
    this.userService = new UserService();
  }

  private async extractAlias (value: string): Promise<string> {
      const index = value.indexOf("@");
      return value.substring(index);
  };

  public async navigateToUserHelper (
    eventTarget: string, 
    authToken: AuthToken,
    displayedUser: User,
    featurePath: string): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const alias = await this.extractAlias(eventTarget);
      const toUser = await this.userService.getUser(authToken, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser)) {
            this._view.setDisplayedUser(toUser);
            this._view.navigateTo(`${featurePath}/${toUser.alias}`);
        }
      }
    }, "get user");
  };
}
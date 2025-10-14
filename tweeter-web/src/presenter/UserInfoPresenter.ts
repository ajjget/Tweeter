import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  navigateTo: (url: string) => void;
  setDisplayedUser: (user: User) => void;
  setIsFollower: (isFollower: boolean) => void;
  setFollowerCount: (followerCount: number) => void;
  setFolloweeCount: (followerCount: number) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private userService: UserService;

  public constructor(view: UserInfoView) {
    super(view);
    this.userService = new UserService();
  }

  public getBaseUrl(pathname: string): string {
    const segments = pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  };

  public NavigateToLoggedInUser(currentUser: User, pathName: string): void {
    this._view.setDisplayedUser(currentUser);
    this._view.navigateTo(`${this.getBaseUrl(pathName)}/${currentUser.alias}`);
  };

  public async followDisplayedUserHelper (
    displayedUser: User,
    authToken: AuthToken
  ): Promise<void> {
    var followingUserToast = "";

    await this.doFailureReportingOperation(async () => {
      followingUserToast = this._view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.userService.follow(
        authToken!,
        displayedUser!
      );

      this._view.setIsFollower(true);
      this._view.setFollowerCount(followerCount);
      this._view.setFolloweeCount(followeeCount);
    }, "follow user");
    
    this._view.deleteMessage(followingUserToast);
  };

  public async unfollowDisplayedUserHelper (
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    var unfollowingUserToast = "";
    
    await this.doFailureReportingOperation(async () => {
      unfollowingUserToast = this._view.displayInfoMessage(`Unfollowing ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.userService.unfollow(
        authToken!,
        displayedUser!
      );

      this._view.setIsFollower(false);
      this._view.setFollowerCount(followerCount);
      this._view.setFolloweeCount(followeeCount);
    }, "unfollow user");
    
    this._view.deleteMessage(unfollowingUserToast);
  };

  public async setNumbFollowees (
    authToken: AuthToken,
    displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this._view.setFolloweeCount(await this.userService.getFolloweeCount(authToken, displayedUser));
    }, "get followees count");
  };

  public async setIsFollowerStatus (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this._view.setIsFollower(false);
      } else {
        this._view.setIsFollower(
          await this.userService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    }, "determine follower status");
  };

  public async setNumbFollowers (
    authToken: AuthToken,
    displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this._view.setFollowerCount(await this.userService.getFollowerCount(authToken, displayedUser));
    }, "get followers count");
  };
}
import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model.service/UserService";
import { MessageView, Presenter } from "../Presenter";

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

  private async updateFollowStatusOnDisplayedUser(
    displayedUser: User, 
    authToken: AuthToken, 
    action: string, 
    isFollowerStatus: boolean, 
    itemDescription: string,
    followOperation: (authToken: AuthToken, displayedUser: User) => Promise<[number, number]>) {
    var followingUserToast = "";

    await this.doFailureReportingOperation(async () => {
      followingUserToast = this._view.displayInfoMessage(`${action} ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await followOperation(
        authToken!,
        displayedUser!
      );

      this._view.setIsFollower(isFollowerStatus);
      this._view.setFollowerCount(followerCount);
      this._view.setFolloweeCount(followeeCount);
    }, itemDescription);
    
    this._view.deleteMessage(followingUserToast);
  }

  public async followDisplayedUserHelper (
    displayedUser: User,
    authToken: AuthToken
  ): Promise<void> {
    await this.updateFollowStatusOnDisplayedUser(
      displayedUser, 
      authToken, 
      "Following", 
      true, 
      "follow user", 
      this.userService.follow.bind(this.userService));
  };

  public async unfollowDisplayedUserHelper (
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    await this.updateFollowStatusOnDisplayedUser(
      displayedUser, 
      authToken, 
      "Unfollowing", 
      false, 
      "unfollow user", 
      this.userService.unfollow.bind(this.userService));
  };

  public async setNumbFollowees (
    authToken: AuthToken,
    displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this._view.setFolloweeCount(await this.userService.getFolloweeCount(authToken, displayedUser));
    }, "get followees count");
  };

  public async setNumbFollowers (
    authToken: AuthToken,
    displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this._view.setFollowerCount(await this.userService.getFollowerCount(authToken, displayedUser));
    }, "get followers count");
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
}
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private statusService: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this.statusService = new StatusService();
  }

  public async submitPostHelper (
    post: string,
    currentUser: User,
    authToken: AuthToken
  ) {
    var postingStatusMessageId = "";
    await this.doFailureReportingOperation(async () => {
      postingStatusMessageId = this._view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser, Date.now());
      await this.statusService.postStatus(authToken, status);

      this._view.setPost("");
      this._view.displayInfoMessage("Status posted!", 2000);
    }, "post the status");

    this._view.deleteMessage(postingStatusMessageId);
  };


}
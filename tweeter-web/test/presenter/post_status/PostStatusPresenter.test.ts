import { AuthToken, Status, User } from "tweeter-shared";
import { PostStatusPresenter, PostStatusView } from "../../../src/presenter/post_status/PostStatusPresenter"
import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito"
import { StatusService } from "../../../src/model.service/StatusService";

describe("PostStatusPresenter", () => {
  let mockPostStatusPresenterView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockService: StatusService;

  const post = "We are 7-0!";
  const currentUser = new User("LJ", "Martin", "lj-martin", "");
  const date = 1760973129343;
  const authToken = new AuthToken("authToken", date);

  beforeEach(() => {
    mockPostStatusPresenterView = mock<PostStatusView>();
    const mockPostStatusPresenterViewInstance = instance(mockPostStatusPresenterView);
    when(mockPostStatusPresenterView.displayInfoMessage(anything(), 0)).thenReturn("postStatusMessageId");
    
    const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusPresenterViewInstance));
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockService = mock<StatusService>();

    when(postStatusPresenterSpy.statusService).thenReturn(instance(mockService));
  })

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPostHelper(post, currentUser, authToken);
    verify(mockPostStatusPresenterView.displayInfoMessage("Posting status...", 0)).once();
  })

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPostHelper(post, currentUser, authToken);

    const status = new Status(post, currentUser, date);
    verify(mockService.postStatus(authToken, anything())).once();

    let [capturedAuthToken, capturedStatus] = capture(mockService.postStatus).last();
    expect(capturedAuthToken).toBe(authToken);
    expect(capturedStatus.post).toBe(post);
  })

  it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when successful", async () => {
    await postStatusPresenter.submitPostHelper(post, currentUser, authToken);

    verify(mockPostStatusPresenterView.deleteMessage("postStatusMessageId")).once();
    verify(mockPostStatusPresenterView.setPost("")).once();
    verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).once();

    verify(mockPostStatusPresenterView.displayErrorMessage(anything())).never();
  })

  it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message when unsuccessful", async () => {
    let error = new Error("An error occurred");
    when(mockService.postStatus(anything(), anything())).thenThrow(error);

    await postStatusPresenter.submitPostHelper(post, currentUser, authToken);

    verify(mockPostStatusPresenterView.displayErrorMessage("Failed to post the status because of an exception: An error occurred"));
    verify(mockPostStatusPresenterView.deleteMessage("postStatusMessageId")).once();

    verify(mockPostStatusPresenterView.setPost("")).never();
    verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", anything())).never();
  })
})
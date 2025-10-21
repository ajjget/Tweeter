import PostStatus from "../../src/components/postStatus/PostStatus"
import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { PostStatusPresenter } from "../../src/presenter/post_status/PostStatusPresenter"
import { instance, mock, verify } from "@typestrong/ts-mockito"
import { AuthToken, User } from "tweeter-shared"
import { useUserInfo } from "../../src/components/userInfo/UserInfoHooks"

const currentUser = new User("LJ", "Martin", "ljmartin", "");
const authToken = new AuthToken("authToken", Date.now());

jest.mock("../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));      

describe("PostStatus Component", () => {
  it("starts with post status and clear buttons disabled", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElement();

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables post status and clear buttons when text field has text", async () => {
    const { user, postStatusButton, clearButton, textField } = renderPostStatusAndGetElement();
    
    await user.type(textField, "BYU won the Holy War!");

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables post status and clear buttons when text field is cleared", async () => {
    const { user, postStatusButton, clearButton, textField } = renderPostStatusAndGetElement();
    await user.type(textField, "BYU won the Holy War!");
    await user.click(clearButton);

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls postStatus method with correct parameters with Post Status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const { user, postStatusButton, textField } = renderPostStatusAndGetElement(mockPresenterInstance);

    const postStatusText = "BYU won the Holy War!";
    await user.type(textField, postStatusText);
    await user.click(postStatusButton);

    verify(mockPresenter.submitPostHelper(postStatusText, currentUser, authToken)).once();
  });
});

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(
    <>
      {!!presenter ? (
        <PostStatus presenter={presenter}/>
      ) : (
        <PostStatus/>
      )}
    </>
  )
}

function renderPostStatusAndGetElement(presenter?: PostStatusPresenter) {
  (useUserInfo as jest.Mock).mockReturnValue({
    currentUser,
    authToken
  });

  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postStatusButton = screen.getByRole("button", { name: /Post Status/i});
  const clearButton = screen.getByRole("button", { name: /Clear/i});
  const textField = screen.getByLabelText("postStatusText");

  return { user, postStatusButton, clearButton, textField };
}
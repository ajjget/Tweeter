import { AuthToken } from "tweeter-shared";
import { LogoutPresenter, LogoutView } from "../../../src/presenter/auth/LogoutPresenter"
import { anything, instance, mock, spy, verify, when } from "@typestrong/ts-mockito"
import { AuthService } from "../../../src/model.service/AuthService";

describe("LogoutPresenter", () => {
  let mockLogoutPresenterView: LogoutView;
  let logoutPresenter: LogoutPresenter;
  let mockService: AuthService;

  const authToken = new AuthToken("authToken", Date.now());

  beforeEach(() => {
    // use this when we're stubbing (telling methods what to do) or verifying
    // doesn't use real logic from LogoutView, just gives you the correct shape
    mockLogoutPresenterView = mock<LogoutView>();
    // use instance in all other cases
    const mockLogoutPresenterViewInstance = instance(mockLogoutPresenterView);
    when(mockLogoutPresenterView.displayInfoMessage(anything(), 0)).thenReturn("messageId123");

    const logoutPresenterSpy = spy(new LogoutPresenter(mockLogoutPresenterViewInstance));
    // spies run real code unless a method stub (overwrite) is specified
    logoutPresenter = instance(logoutPresenterSpy);

    mockService = mock<AuthService>();

    // use spy here because we are stubbing
    when(logoutPresenterSpy.authService).thenReturn(instance(mockService));
  })

  it("tells the view to display a logging out message", async () => {
    await logoutPresenter.logOut(authToken);
    verify(mockLogoutPresenterView.displayInfoMessage(anything(), 0)).once();
  })

  it("calls logout on the user service with the correct auth token", async () => {
    await logoutPresenter.logOut(authToken);
    verify(mockService.logout(authToken)).once();
  })

  it("tells the view to clear the info message that was displayed previously, clear the user info, and navigate to the login page when successful", async () => {
    await logoutPresenter.logOut(authToken);
    verify(mockLogoutPresenterView.deleteMessage("messageId123")).once();
    verify(mockLogoutPresenterView.clearUserInfo()).once();
    verify(mockLogoutPresenterView.navigateTo("/login")).once();

    verify(mockLogoutPresenterView.displayErrorMessage(anything())).never();
  })

  it("tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page when not successful", async () => {
    let error = new Error("An error occurred");
    when(mockService.logout(anything())).thenThrow(error);

    await logoutPresenter.logOut(authToken);

    verify(mockLogoutPresenterView.displayErrorMessage("Failed to log user out because of exception: An error occurred")).once();
    
    verify(mockLogoutPresenterView.deleteMessage(anything())).never();
    verify(mockLogoutPresenterView.clearUserInfo()).never();
    verify(mockLogoutPresenterView.navigateTo("/login")).never();
  })

})
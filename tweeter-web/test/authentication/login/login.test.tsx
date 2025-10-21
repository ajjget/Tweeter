import { MemoryRouter } from "react-router-dom"
import Login from "../../../src/components/authentication/login/Login"
import { render, screen } from "@testing-library/react"
import { UserEvent, userEvent } from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { LoginPresenter } from "../../../src/presenter/auth/LoginPresenter"
import { instance, mock, verify } from "@typestrong/ts-mockito"

library.add(fab);
const alias = "a";
const password = "b";

describe("Login Component", () => {
  it("starts with the sign in button disabled", () => {
    const { signInButton } = renderLoginAndGetElement("/");
    expect(signInButton).toBeDisabled();
  });

  it("enabled the sign in button if both alias and password fields have text", async () => {
    const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElement("/");
    await enterAliasAndPassword(user, aliasField, passwordField);

    expect(signInButton).toBeEnabled();
  });

  it("disables the sign in button if either the alias or the password field is cleared", async () => {
    const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElement("/");
    await enterAliasAndPassword(user, aliasField, passwordField);

    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "a");
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenter's login method with correct parameters when the sign in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const originalUrl = "http://jwt-pizza.click"

    const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElement(originalUrl, mockPresenterInstance);
    await enterAliasAndPassword(user, aliasField, passwordField);

    await user.click(signInButton);

    verify(mockPresenter.doAuthenticationOperation(alias, password, false, originalUrl)).once();
  });
})

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter}/>
      ) : (
        <Login originalUrl={originalUrl}/>
      )}
    </MemoryRouter>
  );
}

function renderLoginAndGetElement(originalUrl: string, presenter?: LoginPresenter) {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i});
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { user, signInButton, aliasField, passwordField };
}

async function enterAliasAndPassword(user: UserEvent, aliasField: HTMLElement, passwordField: HTMLElement) {
  await user.type(aliasField, alias);
  await user.type(passwordField, password);
}

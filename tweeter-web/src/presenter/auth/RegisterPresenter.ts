import { Buffer } from "buffer";
import { AuthPresenter, AuthView } from "./AuthPresenter";
import { User, AuthToken } from "tweeter-shared";

export interface RegisterView extends AuthView {
  setImageUrl: (imageUrl: string) => void;
  setImageBytes: (bytes: Uint8Array) => void;
  setImageFileExtension: (fileExtension: string) => void;
}

export class RegisterPresenter extends AuthPresenter<RegisterView> {
  private firstName!: string;
  private lastName!: string;
  private imageBytes!: Uint8Array;
  private imageFileExtension!: string;

  public constructor(view: RegisterView) {
    super(view);
  }

  public handleImageFile (file: File | undefined) {
    if (file) {
      this._view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this._view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this._view.setImageFileExtension(fileExtension);
      }
    } else {
      this._view.setImageUrl("");
      this._view.setImageBytes(new Uint8Array());
    }
  };

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  };

  protected itemDescription(): string {
    return "register user";
  }

  protected authenticate(alias: string, password: string): Promise<[User, AuthToken]> {
    return this.service.register(
      this.firstName,
      this.lastName,
      alias,
      password,
      this.imageBytes,
      this.imageFileExtension
    );
  }

  public async doRegister(
    firstName: string, 
    lastName: string, 
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.imageBytes = imageBytes;
    this.imageFileExtension = imageFileExtension;

    this.doAuthenticationOperation(alias, password, rememberMe);
  }
}
import { UserDto } from "tweeter-shared";

export class InternalUser {
  private alias: string;
  private firstName: string;
  private lastName: string;
  private imageUrl: string;
  private _passwordHash: string;

  constructor (
    alias: string, 
    firstName: string, 
    lastName: string, 
    imageUrl: string, 
    passwordHash: string) {
      this.alias = alias;
      this.firstName = firstName;
      this.lastName = lastName;
      this.imageUrl = imageUrl;
      this._passwordHash = passwordHash;
    }

  public createUserDto(): UserDto {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      alias: this.alias,
      imageUrl: this.imageUrl
    }
  }

  public get passwordHash(): string {
    return this._passwordHash;
  } 
 }
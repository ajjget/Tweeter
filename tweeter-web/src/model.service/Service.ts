import { ServerFacade } from "./ServerFacade";

export abstract class Service {
  private static _serverFacade = new ServerFacade();

  protected get serverFacade() {
    return (this.constructor as typeof Service)._serverFacade;
  }
}
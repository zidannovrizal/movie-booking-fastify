declare module "bcrypt" {
  export function hash(
    data: string,
    saltOrRounds: string | number
  ): Promise<string>;
  export function compare(data: string, encrypted: string): Promise<boolean>;
}

declare module "jsonwebtoken" {
  export interface JwtPayload {
    id: string;
    email: string;
    role: string;
    [key: string]: any;
  }

  export function sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: string,
    options?: object
  ): string;

  export function verify(
    token: string,
    secretOrPublicKey: string,
    options?: object
  ): JwtPayload | string;
}

declare module "axios" {
  import { AxiosStatic } from "axios";
  const axios: AxiosStatic;
  export default axios;
}

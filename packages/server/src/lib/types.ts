export interface Payload {
  sub: number;
  iss: string;
  iat: number;
  user: {
    username: string;
    email: string;
  };
}

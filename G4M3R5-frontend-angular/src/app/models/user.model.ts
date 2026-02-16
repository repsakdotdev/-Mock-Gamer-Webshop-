export interface User {
  userId: number;
  username: string;
  email: string;
  isAdmin: boolean;
  internationalUser: boolean;
  token?: string;
}
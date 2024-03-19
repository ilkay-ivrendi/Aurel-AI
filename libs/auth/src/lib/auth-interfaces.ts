export const credentialsKey = 'credentials';
export interface Credentials {
  access_token: string;
  user_data: any;
}
export interface LoginCredentials {
  username: string;
  password: string;
  remember: boolean;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  email: string;
}



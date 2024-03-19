export interface RegisterDTO {
    username: string;
    password: string;
    email: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface Credentials {
  access_token: string;
  user_data: UserProfile;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string; 
}

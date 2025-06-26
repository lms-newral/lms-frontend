type User = {
  _id: string;
  email: string;
  name: string;
  username: string;
  phoneNumber: string;
  isVerified: boolean;
  profileImage: string;
  role: string;
  refreshToken: string;
  deviceId: string;
};

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
}

export type { UserState, User };

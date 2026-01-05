interface UserData {
  userName?: string | null | undefined;
  userEmail?: string | null | undefined;
  userPhoto?: string | null | undefined;
}

declare namespace App {
  interface Locals {
    isLoggedIn: boolean;
    userInfo?: UserData | null;
  }
}
interface UserData {
  userName?: string | null | undefined;
  userEmail?: string | null | undefined;
  userPhoto?: string | null | undefined;
}

declare namespace App {
  interface Locals {
    isLoggedIn: boolean;
    userInfo?: UserData | null;
    videoId?: string;
    videoTitle?: string;
  }
}

declare namespace astroHTML.JSX {
  interface IntrinsicElements {
    "lite-youtube": any;
  }
}
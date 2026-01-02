import { loginUser, signOutAction } from '@/actions/auth';
import { lastVideo } from '@/actions/yt/lastVideo.action';

export const server = {
    loginUser,
    signOutAction,
    lastVideo,
}
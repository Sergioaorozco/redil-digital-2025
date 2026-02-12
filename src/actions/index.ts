import { loginUser, signOutAction, updatePasswordAction, updateProfileAction } from '@/actions/auth';
import { getEvents } from "@/actions/events";

export const server = {
    loginUser,
    signOutAction,
    updatePasswordAction,
    updateProfileAction,
    getEvents
}
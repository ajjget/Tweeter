import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { UserNavigationPresenter, UserNavigationView } from "../../presenter/user_navigation/UserNavigationPresenter";
import { useRef } from "react";

export const useUserNavigation = (featurePath: string) => {
    const navigate = useNavigate();
    const { displayErrorMessage } = useMessageActions();
    const { displayedUser, authToken } = useUserInfo();
    const { setDisplayedUser } = useUserInfoActions();

    const listener: UserNavigationView = {
        displayErrorMessage: displayErrorMessage,
        navigateTo: (url: string) => navigate(url),
        setDisplayedUser: setDisplayedUser,
    }

    const presenterRef = useRef<UserNavigationPresenter | null>(null);
    if (!presenterRef.current) {
        presenterRef.current = new UserNavigationPresenter(listener);
    }
    
    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
        presenterRef.current!.navigateToUserHelper(event.target.toString(), authToken!, displayedUser!, featurePath);
    };

    return navigateToUser;
}
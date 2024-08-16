import { useEffect } from "react";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import Bg from "./components/bg/Bg";
import Userinfo from "./components/list/userInfo/Userinfo";
import ChatList from "./components/list/chatList/ChatList";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading)
    return (
      <div className="loaderContaine">
        <span className="loader"></span>
      </div>
    );
  else {
    return (
      <>
        <Bg />
        <div className="chitChat-container">
          {currentUser ? (
            <div className="chat-user-containe">
              <div className="chat-user-user-list-container">
                <Userinfo />
                <ChatList />
              </div>
              {chatId && <Chat />}
              {/* {chatId && <Detail />} */}
            </div>
          ) : (
            <Login />
          )}
          <Notification />
        </div>
      </>
    );
  }
};

export default App;

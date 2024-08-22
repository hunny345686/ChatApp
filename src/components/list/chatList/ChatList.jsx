import { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/addUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import { IoIosSearch } from "react-icons/io";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");
  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();
  const [activeChat, setActiceChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();
          return { ...item, user };
        });

        const chatData = await Promise.all(promises);
        const uniqueChats = chatData.reduce((acc, current) => {
          const x = acc.find((item) => item.user.email === current.user.email);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        changeChat(uniqueChats[0].chatId, uniqueChats[0].user);
        setActiceChat(uniqueChats[0].chatId);
        setChats(uniqueChats.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );
    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    setIsLoading(true);
    console.log(isLoading);
    setActiceChat(chat.chatId);
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });
    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );
    userChats[chatIndex].isSeen = true;
    const userChatsRef = doc(db, "userchats", currentUser.id);
    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  {
    if (isLoading)
      return (
        <div className="loaderContainer">
          <span className="loader"></span>
        </div>
      );
    else {
      return (
        <div className="chatList">
          {filteredChats.length > 0 ? (
            <div className="search">
              <div className="searchBar">
                <IoIosSearch />
                <input
                  type="text"
                  placeholder="Your Contact ..."
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              <p className="contact-heading">Chats</p>
            </div>
          ) : null}
          {filteredChats.map((chat) => (
            <div
              className={activeChat == chat.chatId ? "item active" : "item"}
              key={chat.chatId}
              onClick={() => handleSelect(chat)}
            >
              <img
                className={chat?.isSeen ? "" : "seen"}
                src={
                  chat.user.blocked.includes(currentUser.id)
                    ? "./avatar.png"
                    : chat.user.avatar || "./avatar.png"
                }
                alt=""
              />
              <div className="texts">
                <span>
                  {chat.user.blocked.includes(currentUser.id)
                    ? "User"
                    : chat.user.username}
                </span>
                <p>{chat.lastMessage.substring(0, 40) + "..."}</p>
              </div>
            </div>
          ))}
          <AddUser />
        </div>
      );
    }
  }
};
// };

export default ChatList;

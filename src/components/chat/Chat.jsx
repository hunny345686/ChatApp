import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import { MdCall, MdEmojiEmotions, MdOutlineMic } from "react-icons/md";
import { GoPaperclip } from "react-icons/go";
import { IoIosMore, IoIosSend, IoIosVideocam } from "react-icons/io";
import useClickOutside from "../../customHooks/useClickOutside";

const Chat = () => {
  const [chat, setChat] = useState([]);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [img, setImg] = useState({ file: null, url: "" });
  const [toggel, setToggel] = useState(false);
  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();
  const popupRef = useRef(null);
  const emojiRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setIsLoading(false);
      setChat(res.data());
    });
    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImg({
        file: selectedFile,
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "") return;
    setText("");
    let imgUrl = null;
    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    } finally {
      setImg({
        file: null,
        url: "",
      });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };
  const toggleDropdown = () => {
    setToggel(!toggel);
  };

  const closeDropdown = () => {
    setToggel(false);
  };
  const closeDropdownemoji = () => {
    setOpen(false);
  };

  useClickOutside(popupRef, closeDropdown);
  useClickOutside(emojiRef, closeDropdownemoji);

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>
              It does not matter how slowly you go as long as you do not stop.
            </p>
          </div>
        </div>
        <div className="icons">
          <MdCall />
          <IoIosVideocam />
          <div className="iconsmore">
            <IoIosMore onClick={toggleDropdown} />
            {toggel && (
              <div ref={popupRef} className="user-profil-dropdown">
                <ul>
                  <li>Profile</li>
                  <li>setting</li>
                  <li onClick={handleBlock}>
                    {isCurrentUserBlocked
                      ? "You are Blocked!"
                      : isReceiverBlocked
                      ? "User blocked"
                      : "Block User"}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
          <div
            key={message?.createdAt}
            className={
              message.senderId === currentUser?.id ? "message own" : "message"
            }
          >
            {message.img && <img src={message.img} alt="send img" />}
            <div className="msgbox-container">
              <img
                className="user-img"
                src={
                  message.senderId === currentUser?.id
                    ? currentUser.avatar
                    : user?.avatar
                }
                alt="userimg"
              />
              <div className="msgbox">
                <p className="name-time">
                  <span>
                    {message.senderId === currentUser?.id
                      ? "You"
                      : user?.username}
                  </span>
                  <span>
                    {message.createdAt.toDate().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
                <p className="text-msg">
                  <span>{message.text}</span>
                  {message.senderId === currentUser?.id ? (
                    <span>✓✓</span>
                  ) : null}
                </p>
              </div>
            </div>
          </div>
        ))}
        {img.url && (
          <div className="img-container">
            <div className="img-box">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>

      <div className="bottom">
        <div className="bottom-container">
          <textarea
            className="scrollable-input"
            placeholder={
              isCurrentUserBlocked || isReceiverBlocked
                ? "You cannot send a message"
                : "Type a message..."
            }
            onKeyPress={handleKeyPress}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          ></textarea>
          <div className="icons">
            <label htmlFor="file">
              <GoPaperclip />
            </label>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleImg}
            />
            <MdOutlineMic />
            <div className="emoji">
              <MdEmojiEmotions onClick={() => setOpen((prev) => !prev)} />
              <div className="picker" ref={emojiRef}>
                <EmojiPicker open={open} onEmojiClick={handleEmoji} />
              </div>
            </div>
            <IoIosSend onClick={handleSend} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

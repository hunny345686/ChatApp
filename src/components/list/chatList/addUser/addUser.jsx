import "./addUser.css";
import { db } from "../../../../lib/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();
  useEffect(() => {
    const handleSearch = async () => {
      try {
        // Get All User
        const userRef = collection(db, "users");
        const querySnapShot = await getDocs(userRef);
        const docs = querySnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // get All frendis of current user
        const userDocRef = doc(db, "userchats", currentUser.id);
        const userDocSnap = await getDoc(userDocRef);
        const user = userDocSnap.data();

        // filter all new user
        const allreadyFriendIDs = user.chats.map((chat) => chat.receiverId);
        allreadyFriendIDs.push(currentUser.id);
        const filteredUsers = docs.filter(
          (user) => !allreadyFriendIDs.includes(user.id)
        );
        setUser(filteredUsers);
      } catch (err) {
        console.log(err);
      }
    };
    handleSearch();
  }, [user]);
  const handleAdd = async (userID) => {
    setIsLoading(true);
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, userID), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: userID,
          updatedAt: Date.now(),
        }),
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading)
    return (
      <div className="loaderContainer">
        <span className="loader"></span>
      </div>
    );
  else {
    return (
      <>
        {user?.length > 0 && <p className="contact-heading">Others Users</p>}
        {user?.length > 0 &&
          user.map((user) => (
            <div
              key={user.id}
              className="new-user"
              onClick={() => handleAdd(user.id)}
            >
              <img src={user.avatar || "./avatar.png"} alt="" />
              <span>{user.username}</span>
            </div>
          ))}
      </>
    );
  }
};
export default AddUser;

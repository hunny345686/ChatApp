import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";
import { IoIosMore } from "react-icons/io";
import { useRef, useState } from "react";
import { auth } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import useClickOutside from "../../../customHooks/useClickOutside";

const Userinfo = () => {
  const popupRef = useRef(null);
  const { resetChat } = useChatStore();
  const { currentUser } = useUserStore();
  const [toggel, setToggel] = useState(false);

  const toggleDropdown = () => {
    setToggel(!toggel);
  };

  const closeDropdown = () => {
    setToggel(false);
  };
  useClickOutside(popupRef, closeDropdown);
  const handleLogout = () => {
    auth.signOut();
    resetChat();
  };

  const handleLinkClick = () => {
    closeDropdown(); // Close dropdown on link click
  };

  return (
    <div className="userInfo">
      <div className="user">
        <img src={currentUser.avatar || ".//avatar.png"} alt="" />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <IoIosMore onClick={toggleDropdown} />
        {toggel && (
          <div ref={popupRef} className="user-profil-dropdown">
            <ul>
              <li onClick={handleLinkClick}>Profile</li>
              <li onClick={handleLinkClick}>setting</li>
              <li onClick={handleLogout}>Logout</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Userinfo;

import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";
import { IoIosMore } from "react-icons/io";
import { useState } from "react";

const Userinfo = () => {
  const { currentUser } = useUserStore();
  const [toggel, setToggel] = useState(false);

  const handleToggle = () => {
    setToggel(!toggel);
  };

  return (
    <div className="userInfo">
      <div className="user">
        <img src={currentUser.avatar || ".//avatar.png"} alt="" />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <IoIosMore onClick={handleToggle} />
        {toggel && (
          <div className="user-profil-dropdown">
            <ul>
              <li>Profile</li>
              <li>setting</li>
              <li>Logout</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Userinfo;

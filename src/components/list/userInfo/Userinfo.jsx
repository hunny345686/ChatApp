import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";
import { IoIosMore } from "react-icons/io";

const Userinfo = () => {
  const { currentUser } = useUserStore();

  return (
    <div className="userInfo">
      <div className="user">
        <img src={currentUser.avatar || "./avatar.png"} alt="" />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <IoIosMore />
      </div>
    </div>
  );
};

export default Userinfo;

import { useEffect, useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const [loading, setLoading] = useState(false);
  const [toggel, setToggel] = useState(true);
  const [showPassword, setshowPassword] = useState(false);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
    // VALIDATE INPUTS
    if (!username || !email || !password) {
      setLoading(false);
      return toast.warn("Please enter inputs!");
    }
    if (!avatar.file) return toast.warn("Please upload an avatar!");
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account created! You can login now!");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setToggel(!toggel);
  };

  return (
    <div className="chitChat-login">
      {toggel ? (
        <div className={`chitChat-item ${toggel ? "slide-right" : ""}`}>
          <h2>
            Welcome back to <br /> <strong>ChitChat, </strong>
          </h2>
          <form onSubmit={handleLogin}>
            <input
              autoComplete="off"
              type="text"
              placeholder="Email"
              name="email"
            />
            <div className="chitChat-password-container">
              <input
                autoComplete="off"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
              />
              {showPassword ? (
                <FaEye onClick={() => setshowPassword(false)} />
              ) : (
                <FaEyeSlash onClick={() => setshowPassword(true)} />
              )}
            </div>
            <button disabled={loading} className="chitChat-primery-btn">
              {loading ? "Loading" : "Sign In"}
            </button>
            <p className="chitChat-new-user">
              New User <span onClick={handleToggle}>Click Here</span>
            </p>
          </form>
        </div>
      ) : (
        <div className="chitChat-item chitChat-item-registration-container slide-right">
          <h2>Create an Account</h2>
          <form onSubmit={handleRegister}>
            <label htmlFor="file">
              <img src={avatar.url || "./avatar.png"} alt="" />
              Upload an image
            </label>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleAvatar}
            />
            <input type="text" placeholder="Your Name..." name="username" />
            <input type="text" placeholder="Email" name="email" />
            <div className="chitChat-password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
              />
              {showPassword ? (
                <FaEye onClick={() => setshowPassword(false)} />
              ) : (
                <FaEyeSlash onClick={() => setshowPassword(true)} />
              )}
            </div>
            <button disabled={loading} className="chitChat-primery-btn">
              {loading ? "Loading" : "Register Now"}
            </button>
            <p className="chitChat-new-user">
              Allready User
              <span onClick={handleToggle}> Click Here</span>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;

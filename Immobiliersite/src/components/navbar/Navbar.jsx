import { useContext, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import noAvatarImage from "./../../../public/noavatar.jpg"
import { useNotificationStore } from "../../lib/notificationStore";


function Navbar() {
  const [open, setOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  if(currentUser) fetch();
  return (
    <nav>
      <div className="left">
        <a href="/" className="logo">
          <img src="https://www.shutterstock.com/image-vector/house-logo-template-design-vector-600nw-741515455.jpg" alt="" />
          <span>TrustHome</span>
        </a>

        <a href="/">Home</a>
        <a href="/">About</a>
        <a href="/">Contact</a>

      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            <img
              src={currentUser ? currentUser.avatar : noAvatarImage}
              alt=""
            />
            <span>{currentUser.username}</span>
            <Link to="/profile" className="profile">
            {number > 0 && <div className="notification">{number}</div>}
            <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
          <div className="sign">
            <a href="/login">Sign in</a>
            <a href="/register" className="register">
              Sign up
            </a>
            </div>
          </>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <a href="/">Home</a>
          <a href="/">About</a>
          <a href="/">Contact</a>
          <a href="/">Agents</a>
          <a href="/register">Sign in</a>
          <a href="/login">Sign up</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

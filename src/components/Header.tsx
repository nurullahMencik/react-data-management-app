import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  return (
    <header className="main-header">
      <Link to="/" className="nav-link">
        <h1 className="logo">Web Project</h1>
      </Link>
      <nav className="main-nav">
        <ul className="nav-list">
          <li>
            <Link to="/" className="nav-link">
              Ana Sayfa
            </Link>
          </li>
          <li>
            <Link to="/users" className="nav-link">
              Kullanıcılar
            </Link>
          </li>
          <li>
            <Link to="/posts" className="nav-link">
              Gönderiler
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

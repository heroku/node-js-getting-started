import React from "react";
import { Link } from "react-router-dom";
// import { useHistory } from "react-router-dom";

export default function Navbar() {
  // const history = useHistory();

  // const routeChange = () => {
  //   let path = `/`;
  //   history.push(path);
  // };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
        <h2 className="position-absolute  start-50 translate-middle-x" > <i>Talkers</i> </h2>
            <Link
              to="/"
              className="d-flex align-items-center justify-content-center p-3 link-dark text-decoration-none dropdown-toggle"
              id="dropdownUser3"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://github.com/mdo.png"
                alt="mdo"
                width="24"
                height="24"
                className="rounded-circle"
              />
            </Link>
            <ul
              className="dropdown-menu text-small shadow"
              aria-labelledby="dropdownUser3"
              style={{top:"70px"}}
            >

              <li>
                <Link className="dropdown-item" to="/">
                Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/">
                   Settings
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link className="dropdown-item" to="/">
                  Sign out
                </Link>
              </li>
            </ul>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="#">
                  Chats
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#">
                  Calls
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#">
                  Explore
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#">
                  News
                </Link>
              </li>

            </ul>
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
}

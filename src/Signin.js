import React from "react";

export default function Signin() {
  return (
    <div className="text-center">
      <main className="form-signin">
        <form>
          {/* <img
            className="mb-4"
            src="https://getbootstrap.com/docs/5.1/assets/brand/bootstrap-logo.svg"
            alt=""
            width="72"
            height="57"
          /> */}
          <h1>T</h1>
          <h1 className="h3 mb-3 fw-normal">Welcome To Talkers</h1>
          <p> Please sign in</p>

          <div className="form-floating">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
            />
            <label for="floatingPassword">Password</label>
          </div>

          {/* <div className="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me" /> Remember me
            </label>
          </div> */}
          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Sign in
          </button>
          <p className="mt-4 mb-3 text-muted">New To Talkers? <a href="/">Sign Up</a></p>
          <p className="mt-3 mb-3 text-muted">© 2017–2021</p>
        </form>
      </main>
    </div>
  );
}

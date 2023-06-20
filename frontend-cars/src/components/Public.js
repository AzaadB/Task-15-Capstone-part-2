import { Link } from "react-router-dom";

import React from "react";

const Public = () => {
  const content = (
    <section className="public">
      <header>
        <h1>
          Welcome to <span className="nowrap">Road Records</span>
        </h1>
      </header>
      <main className="public__main">
        <p>
          Located in Beautiful Downtown Foo City, Road Records provides a
          trained staff ready to meet your car information needs.
        </p>
        <address className="public__addr">
          <br />
          Zany Car Notes
          <br />
          <br />
          555 Foo Drive
          <br />
          <br />
          Foo City, CA 12345
          <br />
          <br />
          <a href="tel:+15555555555">(345) 345-9855</a>
        </address>
        <br />
        <p>Owner: Zany Gulaksi</p>
      </main>
      <footer>
        <Link to="/login">Login</Link>
      </footer>
    </section>
  );
  return content;
};

export default Public;

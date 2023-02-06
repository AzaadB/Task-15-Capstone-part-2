import { Link } from "react-router-dom";

import React from "react";

const Public = () => {
  const content = (
    <section className="public">
      <header>
        <h1>
          Welcome to <span className="nowrap">Pete Car Notes</span>
        </h1>
      </header>
      <main className="public__main">
        <p>
          Located in Beautiful Downtown Foo City, Pete Car Notes provides a
          trained staff ready to meet your car information needs.
        </p>
        <address className="public__addr">
          <br />
          Pete Car Notes
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
        <p>Owner: Pete Gulaksi</p>
      </main>
      <footer>
        <Link to="/login">Employee Login</Link>
      </footer>
    </section>
  );
  return content;
};

export default Public;

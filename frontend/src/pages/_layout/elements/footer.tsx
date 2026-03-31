const Footer = () => {
  return (
    <><div className="d-none">
      <section className="footer">
        <div className="footer-top">
          <div className="footer-links">
            <nav className="navbar navbar-expand-sm">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link" href="/responsible-gaming">
                    {" "}
                    Privacy Policy{" "}
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/responsible-gaming">
                    {" "}
                    Rules and Regulation{" "}
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/terms-and-conditions">
                    {" "}
                    Terms and Conditions{" "}
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/responsible-gaming">
                    {" "}
                    Responsible Gaming{" "}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="support-detail">
            <h2>24X7 Support</h2>
            <p></p>
          </div>
          <div className="social-icons-box"></div>
        </div>
      </section>
      <div className="footer-bottom">
        <div className="secure-logo">
          <div>
            <img src="https://wver.sprintstaticdata.com/v3/static/front/img/ssl.png" />
          </div>
          <div className="ml-2">
            <b>100% SAFE</b>
            <div>Protected connection and encrypted data.</div>
          </div>
        </div>
        <div className="d-inline-block">
          <button className="btn p-0">
            <img src="https://versionobj.ecoassetsservice.com/v18/static/front/img/18plus.png" />
          </button>
          <a href="https://www.gamcare.org.uk/">
            <img src="https://versionobj.ecoassetsservice.com/v18/static/front/img/gamecare.png" />
          </a>
          <a href="https://www.gamblingtherapy.org/">
            <img src="https://versionobj.ecoassetsservice.com/v18/static/front/img/gt.png" />
          </a>
        </div>
      </div>
      {/* <div className="footer-text">
      <p></p>
      <p className="text-center">
        © Copyright 2026. All Rights Reserved. Powered by BETBHAI365
      </p>
    </div> */}
    </div><div className="container mt-3">

        {/* TOP LINKS */}
        <div className="text-center mb-2">
          <a href="#" className="mx-2 text-decoration-none text-dark">Privacy Policy</a>

          <span className="mx-2 text-muted">|</span>

          <a href="#" className="mx-2 text-decoration-none text-dark">KYC</a>

          <span className="mx-2 text-muted">|</span>

          <a href="#" className="mx-2 text-decoration-none text-dark">Terms & Conditions</a>
        </div>

        {/* SECOND ROW LINKS */}
        <div className="text-center mb-3">
          <a href="#" className="mx-3 text-decoration-none text-dark">Rules & Regulation</a>

            <span className="mx-2 text-muted">|</span>

          <a href="#" className="mx-3 text-decoration-none text-dark">Responsible Gaming</a>
        </div>

        {/* IMAGE SECTION */}
        <div className="text-center">
          <img
            src="/imgs/foot.png" // 👈 apni image path daal
            alt="info"
            className="img-fluid"
            style={{ maxWidth: "200px" }} />
        </div>

      </div></>
  );
};
export default Footer;

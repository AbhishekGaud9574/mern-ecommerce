import React from "react";
import Layout from "../components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
import "../css/Contact.css";

function Contact() {
  return (
    <Layout title={"Contact Us"}>
      <div className="container contact-page">
        <div className="row align-items-center">
          {/* Left Side Image */}
          <div className="col-md-6">
            <img
              src="/images/contact.webp"
              alt="Contact Us"
              className="contact-image"
            />
          </div>

          {/* Right Side Info */}
          <div className="col-md-6 contact-content">
            <h1 className="contact-heading">Contact Us</h1>

            <p className="contact-details">
              Any query or information about our products? Feel free to contact
              us. We are available 24×7 to help you.
            </p>

            <div className="contact-info">
              <div className="contact-icon">
                <BiMailSend />
              </div>

              <div>
                <h6>Email</h6>
                <p>help@commerceapp.com</p>
              </div>
            </div>

            <div className="contact-info">
              <div className="contact-icon">
                <BiPhoneCall />
              </div>

              <div>
                <h6>Phone</h6>
                <p>+91 98765 43210</p>
              </div>
            </div>

            <div className="contact-info">
              <div className="contact-icon">
                <BiSupport />
              </div>

              <div>
                <h6>Toll Free</h6>
                <p>1800-000-0000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Contact;

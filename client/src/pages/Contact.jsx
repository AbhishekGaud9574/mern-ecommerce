import React from "react";
import Layout from "../components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
// import "./Contact.css";

function Contact() {
  return (
    <Layout title={"Contact Us"}>
      <div className="container mt-5">
        <div className="row align-items-center">
          {/* Left Side Image */}
          <div className="col-md-6">
            <img
              src="/images/contact.webp"
              alt="Contact Us"
              className="img-fluid rounded"
            />
          </div>

          {/* Right Side Info */}
          <div className="col-md-6">
            <h1 className="contact-heading">Contact Us</h1>

            <p className="contact-details">
              Any query or information about our products? Feel free to contact
              us. We are available 24×7 to help you.
            </p>

            <p>
              <BiMailSend size={22} /> <strong>Email:</strong>{" "}
              help@commerceapp.com
            </p>

            <p>
              <BiPhoneCall size={22} /> <strong>Phone:</strong> +91 98765 43210
            </p>

            <p>
              <BiSupport size={22} /> <strong>Toll Free:</strong> 1800-000-0000
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Contact;

import Layout from "../components/Layout/Layout";

function About() {
  return (
    <Layout title="About Us">
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4">
            <img
              src="/images/aboutus.jpg"
              alt="About Us"
              className="img-fluid rounded shadow"
            />
          </div>

          <div className="col-md-6">
            <h2 className="mb-3">About Us</h2>

            <p className="text-muted">
              Receive personalised insights on your best-selling products and
              price competitiveness to gauge user demand, efficiently manage
              your inventory and increase sales.
            </p>

            <p className="text-muted">
              Our eCommerce platform provides a secure, fast, and user-friendly
              shopping experience. We focus on delivering high-quality products,
              excellent customer service, and seamless online shopping.
            </p>

            <p className="text-muted">
              Thank you for choosing our store. Your satisfaction is our top
              priority.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default About;

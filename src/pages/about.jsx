import Footer from "@/components/footer";
import Header from "@/components/header";
import Head from "next/head";
import React from "react";

const About = () => {
  return (
    <>
      <Head>
        <title>About</title>
      </Head>

      <div className="w-full min-h-screen flex flex-col justify-between">
        <Header />
        <div className="max-w-[1223px] h-full mx-auto font-kodchasan text-[18px] md:text-[24px] font-light px-5 sm:px-9 md:px-12 py-7 my-11">
          <h4>Welcome to Oizter!</h4>
          <p>
            Oizter was created after our founder saw this image and realized
            that something absolutely must be done about it.
          </p>
          <br />
          <br />
          <p>
            Here at Oizter where we believe in the power of genuine craft. It is
            only after we realize how amazing artists are and how lucky we are
            as humans to have them, that we will be able to save our earth. We
            know that people love owning things, we love to express ourselves,
            it is in our nature. But our consumer habits have become unethical.
            We don&apos;t think it&apos;s reasonable to ask you to stop owning
            things, but we can hope and dream that you&apos;ll own only good
            things.
          </p>
          <br />
          <p>
            Our mission is to revolutionize the marketplace for boutique
            products by partnering with aspiring artists and designers, ensuring
            their creations are recognized and protected and valued above mass
            produced garbage. We are committed to fostering a community where
            authenticity thrives, and exceptional craftsmanship is celebrated.
          </p>
          <br />
          <h4>At Oizter, we have three core goals:</h4>
          <p>
            1. Invalidate Drop Shippers: We are dedicated to creating a safe
            space for artists by eliminating the presence of drop shippers who
            profit off generic, mass-produced items. Our platform ensures that
            every product sold with one of our certificates is a true original,
            crafted with passion and creativity. We do this by vetting all the
            vendors that partner with us and conducting the right due diligence.
            Not everyone gets to partner up with Oizter, but the real ones
            always do.
          </p>
          <p>
            2. Discourage Dupes and Fakes: We understand the value of
            originality and the hard work that goes into each unique piece.
            Having a centralized system for certificates of authenticity
            guarantees that the products you purchase are authentic, preserving
            the integrity of our artists&apos; work and discouraging counterfeiters.
            If you buy a second hand product that you believe comes from one of
            our partnered vendors, always ask for the Oizter certificate to make
            sure that it is original!
          </p>
          <p>
            3. Encourage Value-Driven Purchases: In a world dominated by fast
            fashion and disposable goods, we encourage our customers to invest
            in products that hold true value. Our curated collection of boutique
            items reflects the dedication and artistry of our creators, offering
            pieces that are not only beautiful but meaningful.
          </p>
          <br />
          <p>
            Our selection and plan process at Oizter supports all artists, and
            we make sure to put exceptional effort in supporting smaller
            artists.
          </p>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default About;

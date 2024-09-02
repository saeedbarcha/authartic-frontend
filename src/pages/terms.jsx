import Footer from "@/components/footer";
import Header from "@/components/header";
import Head from "next/head";
import React from "react";

const Terms = () => {
  return (
    <>
      <Head>
        <title>Terms</title>
      </Head>
      <div className="w-full min-h-screen flex flex-col justify-between">
        <Header />
        <div className="h-full max-w-[1223px] mx-auto  font-kodchasan text-[18px] md:text-[24px] font-light px-5 sm:px-9 md:px-12 py-7 my-11">
          <h4>Terms and Services</h4>
          <h4>Introduction</h4>
          <p>
            Welcome to Authentic Creations (&quot;we,&quot; &quot;our,&quot; or
            &quot;us&quot;). These Terms and Services (&quot;Terms&quot;) govern
            your use of our website, app, and any related services provided by
            Authentic Creations (collectively, the &quot;Service&quot;). By
            accessing or using the Service, you agree to be bound by these
            Terms. If you do not agree to these Terms, please do not use the
            Service.
          </p>
          <h4>1. User Accounts</h4>
          <p>
            1.1. To use certain features of the Service, you must create an
            account. You agree to provide accurate, current, and complete
            information during the registration process and to update such
            information as necessary to keep it accurate, current, and complete.
          </p>
          <p>
            1.2. You are responsible for maintaining the confidentiality of your
            account password and for all activities that occur under your
            account. You agree to notify us immediately of any unauthorized use
            of your account.
          </p>
          <h4>2. Artist and Designer Partnership</h4>
          <p>
            2.1. By partnering with us, artists and designers agree to provide
            authentic, original products for sale on our platform.
          </p>
          <p>
            2.2. Authentic Creations will verify the authenticity of each
            product through a proprietary verification process. Artists and
            designers agree to cooperate fully in this process.
          </p>
          <p>
            2.3. Artists and designers retain all intellectual property rights
            to their creations. However, by listing products on our platform,
            they grant us a non-exclusive, worldwide, royalty-free license to
            use, reproduce, and display the products for marketing and
            promotional purposes.
          </p>
          <h4>3. Purchases and Payments</h4>
          <p>
            3.1. All sales are final. We do not accept returns or exchanges
            unless the product received is not as described or is defective.
          </p>
          <p>
            3.2. Payments are processed through secure third-party payment
            processors. By making a purchase, you agree to the terms and
            conditions of these payment processors.
          </p>
          <h4>4. Prohibited Activities</h4>
          <p>
            4.1. You agree not to engage in any of the following prohibited
            activities: Using the Service for any unlawful purpose or in
            violation of any local, state, national, or international law.
            Impersonating any person or entity, or falsely stating or otherwise
            misrepresenting your affiliation with a person or entity.
            Interfering with or disrupting the Service or servers or networks
            connected to the Service.
          </p>
          <h4>5. Intellectual Property</h4>
          <p>
            5.1. All content on the Service, including text, graphics, logos,
            images, and software, is the property of Authentic Creations or its
            content suppliers and is protected by intellectual property laws.
          </p>
          <p>
            5.2. You agree not to reproduce, duplicate, copy, sell, resell, or
            exploit any portion of the Service without express written
            permission from us.
          </p>
          <h4>6. Limitation of Liability</h4>
          <p>
            6.1. To the fullest extent permitted by law, Authentic Creations
            shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages, or any loss of profits or
            revenues, whether incurred directly or indirectly, or any loss of
            data, use, goodwill, or other intangible losses, resulting from (a)
            your use or inability to use the Service; (b) any unauthorized
            access to or use of our servers and/or any personal information
            stored therein.
          </p>
          <h4>7. Changes to Terms</h4>
          <p>
            7.1. We reserve the right to modify these Terms at any time. We will
            notify you of any changes by posting the new Terms on the Service.
            You are advised to review these Terms periodically for any changes.
            Changes to these Terms are effective when they are posted on this
            page.
          </p>
          <h4>8. Governing Law</h4>
          <p>
            8.1. These Terms shall be governed and construed in accordance with
            the laws of the jurisdiction in which Authentic Creations operates,
            without regard to its conflict of law provisions.
          </p>
          <h4>9. Contact Us</h4>
          <p>
            9.1. If you have any questions about these Terms, please contact us
            at [contact email]. By using our Service, you acknowledge that you
            have read, understood, and agree to be bound by these Terms and
            Services.
          </p>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Terms;

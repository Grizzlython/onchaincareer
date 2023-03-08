// import App from 'next/app'

import "@solana/wallet-adapter-react-ui/styles.css";
import GoogleAnalytics from "@bradgarropy/next-google-analytics";
import SEO from "@bradgarropy/next-seo";

import { WalletConnectProvider } from "../components/WalletConnectProvider";
import Layout from "../components/Layout";

import { GlobalProvider } from "../context/GlobalContext";

// import "../assets/fonts/fontawesome-5/webfonts/fa-brands-400.ttf";
// import "../assets/fonts/fontawesome-5/webfonts/fa-regular-400.ttf";
import "../assets/fonts/fontawesome-5/css/all.min.css";

// import "../assets/fonts/icon-font/css/style.css";

import "../../node_modules/slick-carousel/slick/slick.css";
import "../../node_modules/slick-carousel/slick/slick-theme.css";
import "../../node_modules/aos/dist/aos.css";

import "../assets/fonts/icon-font/css/style.css";
import "../assets/fonts/fontawesome-5/css/all.css";

import "../scss/bootstrap.scss";
import "../scss/main.scss";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "tippy.js/dist/tippy.css";
import imgFavicon from "../assets/image/favicon.png";

const MyApp = ({ Component, pageProps, router }) => {
  return (
    <WalletConnectProvider>
      <Content Component={Component} pageProps={pageProps} router={router} />
    </WalletConnectProvider>
  );
};
const Content = ({ Component, pageProps, router }) => {
  if (router.pathname.match(/404/)) {
    return (
      <GlobalProvider>
        <Layout pageContext={{ layout: "bare" }}>
          <ToastContainer
            position="top-left"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <SEO
            title="Onchaincareer"
            description="OnChainCareer is a decentralized, blockchain-powered company on Solana that offers a secure job marketplace where all interactions are transparent and fraud-proof. Its innovative use of blockchain technology ensures reliable and efficient job solutions for job seekers, employers, and stakeholders in the job market. Discover the power of OnChainCareer today and experience a new standard in the world of blockchain-based job platforms"
            keywords={[
              "OnChainCareer",
              "blockchain",
              "Solana",
              "decentralized",
              "job marketplace",
              "secure",
              "transparent",
              "fraud-proof",
              "job platform",
              "reliable",
              "efficient",
              "job seekers",
              "employers",
              "stakeholders",
            ]}
            icon={imgFavicon.src}
          />
          <GoogleAnalytics measurementId="G-ZTJFFEK852" />
          <Component {...pageProps} />
        </Layout>
      </GlobalProvider>
    );
  }
  if (router.pathname.match(/dashboard/)) {
    return (
      <GlobalProvider>
        <Layout pageContext={{ layout: "dashboard" }}>
          <ToastContainer
            position="top-left"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <SEO
            title="Onchaincareer"
            description="OnChainCareer is a decentralized, blockchain-powered company on Solana that offers a secure job marketplace where all interactions are transparent and fraud-proof. Its innovative use of blockchain technology ensures reliable and efficient job solutions for job seekers, employers, and stakeholders in the job market. Discover the power of OnChainCareer today and experience a new standard in the world of blockchain-based job platforms"
            keywords={[
              "OnChainCareer",
              "blockchain",
              "Solana",
              "decentralized",
              "job marketplace",
              "secure",
              "transparent",
              "fraud-proof",
              "job platform",
              "reliable",
              "efficient",
              "job seekers",
              "employers",
              "stakeholders",
            ]}
            icon={imgFavicon.src}
          />
          <GoogleAnalytics measurementId="G-YKJR2656CT" />
          <Component {...pageProps} />
        </Layout>
      </GlobalProvider>
    );
  }

  return (
    <GlobalProvider>
      <Layout pageContext={{}}>
        <ToastContainer
          position="top-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <SEO
          title="OnChainCareer"
          description="OnChainCareer is a decentralized, blockchain-powered company on Solana that offers a secure job marketplace where all interactions are transparent and fraud-proof. Its innovative use of blockchain technology ensures reliable and efficient job solutions for job seekers, employers, and stakeholders in the job market. Discover the power of OnChainCareer today and experience a new standard in the world of blockchain-based job platforms"
          keywords={[
            "OnChainCareer",
            "blockchain",
            "Solana",
            "decentralized",
            "job marketplace",
            "secure",
            "transparent",
            "fraud-proof",
            "job platform",
            "reliable",
            "efficient",
            "job seekers",
            "employers",
            "stakeholders",
          ]}
          icon={imgFavicon.src}
        />
        <GoogleAnalytics measurementId="G-YKJR2656CT" />
        <Component {...pageProps} />
      </Layout>
    </GlobalProvider>
  );
};

export default MyApp;

// import App from 'next/app'
import { useMemo, ReactNode, FC } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolletWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

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

const MyApp = ({ Component, pageProps, router }) => {
  return (
    <WalletConnectProvider>
      <Content Component={Component} pageProps={pageProps} router={router} />
    </WalletConnectProvider>
  );
};

const Context = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = "devnet";
  // "https://wider-necessary-morning.solana-mainnet.discover.quiknode.pro/a37be890809d96297d14465d9dc1c05efb52c51f/";

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // const endpoint = network

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolletWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
const Content = ({ Component, pageProps, router }) => {
  // const { connection } = useConnection();
  // const connection = new Connection("http://localhost:8899")

  // const onClick = useCallback(async () => {
  //   if (!publicKey) {
  //     throw new WalletNotConnectedError()
  //     return
  //   }
  //   const transaction = new Transaction().add(
  //     SystemProgram.transfer({
  //       fromPubkey: publicKey,
  //       toPubkey: new PublicKey('G5vTuiduXEgj1oGyM29XoZ8uGPkR36oMwFXKQ5EW8Z9a'),
  //       lamports: 100000,
  //     })
  //   );

  //   const signature = await sendTransaction(transaction, connection);

  //   const result = await connection.confirmTransaction(signature, 'processed');
  // }, [publicKey, sendTransaction, connection]);

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
        <Component {...pageProps} />
      </Layout>
    </GlobalProvider>
  );
};

export default MyApp;

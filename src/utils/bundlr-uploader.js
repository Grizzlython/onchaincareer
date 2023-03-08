import BigNumber from "bignumber.js";
import { sleep } from "@bundlr-network/client/build/common/upload";
import {
  BUNDLR_CURRENCY,
  BUNDLR_ENDPOINT,
  SOLANA_RPC_NETWORK,
} from "./constants";
import { WebBundlr } from "@bundlr-network/client";
import { toast } from "react-toastify";

export const getStorageCost = async (bundlr, size) => {
  if (size) {
    const price = await bundlr?.utils.getPrice(BUNDLR_CURRENCY, size);
    //@ts-ignore
    return price;
    // setPrice(price?.toString());
  } else {
    return -1;
  }
};

export const initiateBundlr = async (adapter) => {
  const walletAdapter = adapter;
  const bundlr = new WebBundlr(
    BUNDLR_ENDPOINT,
    BUNDLR_CURRENCY,
    walletAdapter,
    {
      providerUrl: SOLANA_RPC_NETWORK,
    }
  );
  try {
    await bundlr.utils.getBundlerAddress(BUNDLR_CURRENCY);
  } catch {
    //   toast({ status: "error", title: `Failed to connect to bundlr ${BUNDLR_ENDPOINT}`, duration: 10000 });
    return {
      status: false,
      error: `Failed to connect to bundlr ${BUNDLR_ENDPOINT}`,
    };
  }
  try {
    await bundlr.ready();
  } catch (err) {
    console.log(err);
    return {
      status: false,
      error: `Failed to connect to bundlr ${BUNDLR_ENDPOINT}`,
    };
  } //@ts-ignore
  if (!bundlr.address) {
    return {
      status: false,
      error: "No Bundlr address found",
    };
  }
  console.log("Connected to the Bundlr");
  return {
    status: true,
    bundlr,
  };
};

export const uploadViaBundlr = async (bundlr, buffer, type) => {
  const uploader = bundlr?.uploader.chunkedUploader;
  if (!uploader) {
    console.log("no uploader");
    return {
      status: false,
      error: "No uploader",
    };
  }
  console.log("starting the upload");

  // toast({ status: "success", title: `Connected to ${BUNDLR_ENDPOINT}` });
  return new Promise((resolve, reject) => {
    uploader?.setBatchSize(2);
    uploader?.setChunkSize(2_000_000);
    uploader?.on("chunkUpload", (e) => {
      console.log("upload started");
      // toast({
      //   status: "info",
      //   title: "Upload progress",
      //   description: `${((e.totalUploaded / ((size ?? 0))) * 100).toFixed()}%`
      // });
    });
    uploader
      ?.uploadData(buffer, {
        tags: [
          { name: "Content-Type", value: type ?? "application/octet-stream" },
        ],
      })

      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          // toast({
          //   status: "success",
          //   title: "Upload complete",
          //   description: `File uploaded successfully`
          // });
          console.log("upload complete");
          return resolve({
            status: true,
            asset_address: `https://arweave.net/${res.data.id}`,
          });
        } else {
          // toast({
          //   status: "error",
          //   title: "Upload failed",
          //   description: `File upload failed`
          // });
          console.log("upload failed");
          return resolve({
            status: false,
            error: "Upload failed with status code " + res?.status,
          });
        }
      })
      .catch((e) => {
        // toast({ status: "error", title: `Failed to upload - ${e}` });
        // return resolve({
        //   status: false,
        //     error: "Upload failed with error " + e
        // });
      });
  });
};

// parse decimal input into atomic units
export const parseInput = (bundlr, input) => {
  console.log(
    bundlr.currencyConfig.base[1],
    "--bundlr!.currencyConfig.base[1]--"
  );
  const conv = new BigNumber(input).multipliedBy(bundlr.currencyConfig.base[1]);
  if (conv.isLessThan(1)) {
    //   toast({ status: "error", title: `Value too small!` });
    return;
  }
  return conv;
};

export const checkForBalance = async (bundlr, size) => {
  try{
    let price = await getStorageCost(bundlr, size); //price in BigNumber format
  let convertedPriceInUnits = bundlr.utils.unitConverter(price); //returns price in terms of lamports (1 SOL = 1,000,000,000 lamports) in BigNumber format

  let bundlrWalletBalance = await bundlr.getLoadedBalance(); //balance in BigNumber format
  let convertedWalletbalanceInUnits =
    bundlr.utils.unitConverter(bundlrWalletBalance);

  if (convertedWalletbalanceInUnits.isLessThan(convertedPriceInUnits)) {
    toast.info("No wallet found or balance is zero. Recharging the wallet");
    //No arweave wallet found, create one
    let amountToFund = parseInput(bundlr, convertedPriceInUnits.toString());
    if (!amountToFund) {
      return {
        status: false,
        error: "Value too small to recharge the wallet. Please try again with a higher image size"
      }
    };
    await bundlr.fund(amountToFund);
    await sleep(2_000);
    return {
      status: true,
      error: null
    }
  }
  return {
    status: true,
    error: null
  }

  }catch(err){
    console.log(err,' err in checkForBalance')
    return {
      status: false,
      error: err && err.message || "Failed to get balance or recharge the wallet. Please try again",
    }
  }
  
};

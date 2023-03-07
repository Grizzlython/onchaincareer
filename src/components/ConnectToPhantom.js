import { useEffect, useState } from "react";

import { connection } from "../../src/utils/web3/connection";
import { add_user_info } from "../utils/web3/web3_functions";

// type Event = "connect" | "disconnect";

// interface Phantom {
//   on: (event: Event, callback: () => void) => void;
//   connect: () => Promise<void>;
//   disconnect: () => Promise<void>;
// }

const ConnectToPhantom = () => {
  const [phantom, setPhantom] = useState(null);

  useEffect(() => {
    if ("solana" in window) {
      setPhantom(window["solana"]);
    }
  }, []);

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    phantom?.on("connect", () => {
      setConnected(true);
      console.log(phantom, "phantom full");
      console.log(phantom.publicKey.toString(), "phantom");

      const signTransaction = phantom.signTransaction;

      const publicKey = phantom.publicKey;

      (async () => {
        // const payload = {
        //   username: publicKey.toString(),
        //   user_type: "applicant",
        //   is_company_profile_complete: false,
        //   is_overview_complete: false,
        //   is_projects_complete: false,
        //   is_contact_info_complete: false,
        //   is_education_complete: false,
        //   is_work_experience_complete: false,
        // };

        const applicantInfo = {
          username: phantom.publicKey.toString(),
          name: "Sandeep Ghosh",
          address: "Metaverse",
          image_uri: "https://dummy.org",
          bio: "applicant bio",
          skills: ["Developer", "Speaker"],
          designation: "Developer",
          current_employment_status: "Startup",
          can_join_in: "never",
          user_type: "applicant",
          is_company_profile_complete: false,
          is_overview_complete: false,
          is_projects_complete: false,
          is_contact_info_complete: false,
          is_education_complete: false,
          is_work_experience_complete: false,
        };
        console.log(connection, "---connection--- user_info");
        const addUserRes = await add_user_info(
          publicKey,
          applicantInfo,
          connection,
          signTransaction
        );

        console.log(addUserRes);

        if (addUserRes && addUserRes.length) {
          toast.success("User added successfully");
        } else {
          toast.error("User not added");
        }
        toast.success("👍 Wallet Connected");
      })();
    });

    phantom?.on("disconnect", () => {
      setConnected(false);
    });
  }, [phantom]);

  const connectHandler = () => {
    phantom?.connect();
  };

  const disconnectHandler = () => {
    phantom?.disconnect();
  };

  if (phantom) {
    if (connected) {
      return (
        <button
          onClick={disconnectHandler}
          className="py-2 px-4 border border-purple-700 rounded-md text-sm font-medium text-purple-700 whitespace-nowrap hover:bg-purple-200"
        >
          Disconnect from Phantom
        </button>
      );
    }

    return (
      <button
        onClick={connectHandler}
        className="bg-purple-500 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white whitespace-nowrap hover:bg-opacity-75"
      >
        Connect to Phantom
      </button>
    );
  }

  return (
    <a
      href="https://phantom.app/"
      target="_blank"
      className="bg-purple-500 px-4 py-2 border border-transparent rounded-md text-base font-medium text-white"
    >
      Get Phantom
    </a>
  );
};

export default ConnectToPhantom;

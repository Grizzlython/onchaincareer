export const connectionString = "devnet";
export const COMMITMENT = "singleGossip";

// export const connection = new Connection(
//     "http://localhost:8899",
//     'confirmed'
// )

import { Connection, clusterApiUrl } from "@solana/web3.js";

export const connection = new Connection(
  clusterApiUrl(connectionString),
  "confirmed"
);

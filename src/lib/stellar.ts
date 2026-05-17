import { Horizon, Networks, Keypair, TransactionBuilder, Operation, Asset, BASE_FEE } from "@stellar/stellar-sdk";

const NETWORK = process.env.STELLAR_NETWORK === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;
const HORIZON_URL = process.env.STELLAR_HORIZON_URL ?? "https://horizon-testnet.stellar.org";

export const server = new Horizon.Server(HORIZON_URL);

export const USDC_ASSET = new Asset(
  "USDC",
  process.env.STELLAR_NETWORK === "mainnet"
    ? "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN"
    : "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"
);

export async function sendUsdc(
  sourceSecret: string,
  destination: string,
  amount: string
): Promise<string> {
  const source = Keypair.fromSecret(sourceSecret);
  const account = await server.loadAccount(source.publicKey());
  const tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase: NETWORK })
    .addOperation(Operation.payment({ destination, asset: USDC_ASSET, amount }))
    .setTimeout(30)
    .build();
  tx.sign(source);
  const result = await server.submitTransaction(tx);
  return result.hash;
}

export async function verifyTransaction(txHash: string): Promise<boolean> {
  try {
    const tx = await server.transactions().transaction(txHash).call();
    return tx.successful;
  } catch {
    return false;
  }
}

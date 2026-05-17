import { server, USDC_ASSET } from "@/lib/stellar";

export async function getAccountBalance(address: string): Promise<string> {
  const account = await server.loadAccount(address);
  const usdcBalance = account.balances.find(
    (b) => b.asset_type !== "native" &&
      (b as { asset_code: string }).asset_code === USDC_ASSET.getCode()
  );
  return usdcBalance ? (usdcBalance as { balance: string }).balance : "0";
}

export async function accountExists(address: string): Promise<boolean> {
  try {
    await server.loadAccount(address);
    return true;
  } catch {
    return false;
  }
}

import { WebIrys } from "@irys/sdk";
import { providers } from "ethers";

import BigNumber from "bignumber.js";
import getRpcUrl from "./getRpcUrl";

interface WindowWithEthereum extends Window {
	ethereum?: any;
}

/**
 * Creates a new Irys object with the specified configuration.
 *
 * @param {string} url - The Irys network URL.
 * @param {string} currency - The currency to use (e.g., "matic").
 * @param {string} providerUrl - The provider URL for the Ethereum network.
 * @returns {Promise<WebIrys>} - A reference to the initialized Irys object.
 */
const getIrys = async (
	url: string = process.env.NEXT_PUBLIC_NODE || "",
	token: string = process.env.NEXT_PUBLIC_TOKEN || "",
): Promise<WebIrys> => {
	await (window as WindowWithEthereum).ethereum.enable();
	const provider = new providers.Web3Provider((window as WindowWithEthereum).ethereum);
	const wallet = { name: "ethersv5", provider: provider };
	const webIrys = new WebIrys({ url, token, wallet });
	await webIrys.ready();

	console.log(`Conected to webIrys from ${webIrys.address}`);
	return webIrys;
};

export default getIrys;

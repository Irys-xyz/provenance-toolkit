import { WebBundlr } from "@bundlr-network/client";
import { providers } from "ethers";

import BigNumber from "bignumber.js";
import getRpcUrl from "./getRpcUrl";

interface WindowWithEthereum extends Window {
	ethereum?: any;
}

/**
 * Creates a new Bundlr object with the specified configuration.
 *
 * @param {string} url - The Bundlr network URL.
 * @param {string} currency - The currency to use (e.g., "matic").
 * @param {string} providerUrl - The provider URL for the Ethereum network.
 * @returns {Promise<WebBundlr>} - A reference to the initialized Bundlr object.
 */
const getBundlr = async (
	url: string = process.env.NEXT_PUBLIC_NODE || "",
	currency: string = process.env.NEXT_PUBLIC_CURRENCY || "",
): Promise<WebBundlr> => {
	await (window as WindowWithEthereum).ethereum.enable();
	const provider = new providers.Web3Provider((window as WindowWithEthereum).ethereum);

	const bundlr = new WebBundlr(url, currency, provider);
	await bundlr.ready();
	return bundlr;
};

export default getBundlr;

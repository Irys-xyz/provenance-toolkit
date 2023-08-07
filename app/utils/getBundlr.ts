interface WindowWithEthereum extends Window {
	ethereum?: any;
}

import { WebBundlr } from "@bundlr-network/client";
import { ethers, Signer } from "ethers";

/**
 * Creates a new Bundlr object with the specified configuration.
 *
 * @param {string} url - The Bundlr network URL.
 * @param {string} currency - The currency to use (e.g., "matic").
 * @param {string} providerUrl - The provider URL for the Ethereum network.
 * @returns {Promise<WebBundlr>} - A reference to the initialized Bundlr object.
 */
const getBundlr = async (
	url: string = "https://devnet.bundlr.network",
	currency: string = "matic",
	providerUrl: string = "https://rpc-mumbai.maticvigil.com",
): Promise<WebBundlr> => {
	//@ts-ignore
	const provider = new ethers.BrowserProvider(window.ethereum);
	const signer = await provider.getSigner();
	//@ts-ignore
	provider.getSigner = () => signer;
	//@ts-expect-error
	signer._signTypedData = (domain, types, value) => signer.signTypedData(domain, types, value);
	console.log("url=", url);
	console.log("currency=", currency);
	console.log("providerUrl=", providerUrl);

	const bundlr = new WebBundlr(url, currency, provider, { providerUrl });

	await bundlr.ready();
	console.log("bundlr=", bundlr);

	return bundlr;
};

export default getBundlr;

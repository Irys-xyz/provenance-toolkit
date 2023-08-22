interface WindowWithEthereum extends Window {
	ethereum?: any;
}

import { WebBundlr } from "@bundlr-network/client";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import getRpcUrl from "./getRpcUrl";

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
	const provider = new ethers.BrowserProvider(window.ethereum);

	provider.getGasPrice = async () => {
		const gp = +((await provider.getFeeData()).gasPrice?.toString() ?? 0);
		console.log("getGasPrice", gp, typeof gp);
		return gp;
	};

	const e = provider.estimateGas.bind(provider);
	provider.estimateGas = async (tx) => {
		const est = +((await e(tx))?.toString() ?? 0);
		return { mul: (n) => +est * +n };
	};

	const signer = await provider.getSigner();

	signer.estimateGas = e;
	signer.getGasPrice = provider.getGasPrice;
	provider.getSigner = () => signer;

	signer._signTypedData = (domain, types, value) => signer.signTypedData(domain, types, value);

	const providerUrl = getRpcUrl(currency);

	const bundlr = new WebBundlr(url, currency, provider, providerUrl ? { providerUrl } : {});

	bundlr.currencyConfig.createTx = async (amount, to) => {
		const estimatedGas = await signer.estimateGas({ to, from: bundlr.address, amount });
		const gasPrice = await signer.getGasPrice();
		const txr = await signer.populateTransaction({
			// eslint-disable-next-line no-undef
			to,
			from: bundlr.address,
			value: BigInt(amount),
			gasPrice,
			gasLimit: estimatedGas,
		});
		return { txId: undefined, tx: txr };
	};

	bundlr.currencyConfig.getTx = async function (txId: string): Promise<Tx> {
		const provider = this.providerInstance;
		const response = await provider.getTransaction(txId);

		if (!response) throw new Error("Tx doesn't exist");
		if (!response.to) throw new Error(`Unable to resolve transactions ${txId} receiver`);

		return {
			from: response.from,
			to: response.to,
			blockHeight: response.blockNumber ? new BigNumber(response.blockNumber) : undefined,
			amount: new BigNumber(response.value),
			pending: response.blockNumber ? false : true,
			confirmed: response.confirmations >= this.minConfirm,
		};
	};
	await bundlr.ready();
	console.log("bundlr=", bundlr);

	return bundlr;
};

export default getBundlr;

import Bundlr from "@bundlr-network/client";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Given a file of the specified size, get the cost to upload, then fund a node that amount
 * @param filesize The size of a file to fund for
 * @returns
 */
export async function lazyFund(filesize: string): Promise<string> {
	// nodeJS client
	const key = process.env.PAYMENT_PRIVATE_KEY; // your private key
	const bundlrNodeAddress = process.env.BUNDLR_NODE_ADDRESS;
	const rpcUrl = process.env.RPC;

	const serverBundlr = new Bundlr(
		//@ts-ignore
		bundlrNodeAddress,
		"matic",
		key,
		{
			providerUrl: rpcUrl,
		},
	);
	console.log(
		"serverBundlrPubKey",
		//@ts-ignore
		serverBundlr.currencyConfig.getPublicKey().toJSON(),
	);

	const price = await serverBundlr.getPrice(parseInt(filesize));
	console.log("price=", price.toString());
	const fundTx = await serverBundlr.fund(price);
	console.log("successfully funded fundTx=", fundTx);

	// return the transaction id
	return fundTx.id;
}
// req: NextApiRequest,
// res: NextApiResponse,
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const body = JSON.parse(req.body);
	console.log("lazyFund body=", body);
	const fundTx = await lazyFund(body);

	res.status(200).json({ txResult: fundTx });
}

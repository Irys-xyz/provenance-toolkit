import { TypedEthereumSigner } from "arbundles";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @returns The server's private key.
 */
export async function serverInit(): Promise<Buffer> {
	const key = process.env.PAYMENT_PRIVATE_KEY; // your private key;
	if(!key) throw new Error("Private key is undefined!")
	const signer = new TypedEthereumSigner(key)
	return signer.publicKey
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	res.status(200).json({ pubKey: (await serverInit()).toString("hex") });
}

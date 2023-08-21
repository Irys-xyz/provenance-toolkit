import type { NextApiRequest, NextApiResponse } from "next";
import { TypedEthereumSigner } from "arbundles";

/**
 *
 * @returns A signed version of the data, signatureData, as sent by the client.
 */
export async function signDataOnServer(signatureData: Buffer): Promise<Buffer> {
	const key = process.env.PAYMENT_PRIVATE_KEY; // your private key
	if(!key) throw new Error("Private key is undefined!")
	const signer = new TypedEthereumSigner(key)
	return Buffer.from(await signer.sign(signatureData))

}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const body = JSON.parse(req.body);
	const signatureData = Buffer.from(body.signatureData, "hex");
	const signature = await signDataOnServer(signatureData);
	res.status(200).json({ signature: signature.toString("hex") });
}

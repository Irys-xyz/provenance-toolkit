import type { NextApiRequest, NextApiResponse } from "next";
import { TypedEthereumSigner } from "arbundles";
import { NextResponse } from "next/server";

/**
 *
 * @returns A signed version of the data, signatureData, as sent by the client.
 */
export async function signDataOnServer(signatureData: Buffer): Promise<Buffer> {
	const key = process.env.PRIVATE_KEY; // your private key
	if (!key) throw new Error("Private key is undefined!");
	const signer = new TypedEthereumSigner(key);
	return Buffer.from(await signer.sign(signatureData));
}

async function readFromStream(stream: ReadableStream): Promise<string> {
	const reader = stream.getReader();
	let result = "";

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		result += new TextDecoder().decode(value);
	}

	return result;
}

export async function POST(req: NextApiRequest) {
	const rawData = await readFromStream(req.body);
	const body = JSON.parse(rawData);

	const signatureData = Buffer.from(body.signatureData, "hex");
	const signature = await signDataOnServer(signatureData);

	return NextResponse.json({ signature: signature.toString("hex") });
}

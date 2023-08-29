import { TypedEthereumSigner } from "arbundles";
import { NextResponse } from "next/server";

/**
 * @returns The server's public key.
 */
async function serverInit(): Promise<Buffer> {
	const key = process.env.PRIVATE_KEY; // your private key;
	console.log("key=", key);
	if (!key) throw new Error("Private key is undefined!");
	const signer = new TypedEthereumSigner(key);
	return signer.publicKey;
}

export async function GET(req: Request) {
	return NextResponse.json({ pubKey: (await serverInit()).toString("hex") });
}

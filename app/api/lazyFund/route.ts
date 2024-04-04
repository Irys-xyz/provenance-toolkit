import Irys from "@irys/sdk";
import getRpcUrl from "../../utils/getRpcUrl";
import { NextResponse } from "next/server";
import { ReadableStream } from "stream/web";

/**
 * Given a file of the specified size, get the cost to upload, then fund a node that amount
 * @param filesize The size of a file to fund for
 * @returns
 */
async function lazyFund(filesize: string): Promise<string> {
	// nodeJS client
	const key = process.env.PRIVATE_KEY;
	const token = process.env.NEXT_PUBLIC_TOKEN || "";
	const network = process.env.NEXT_PUBLIC_NETWORK || "devnet";
	const providerUrl = getRpcUrl(token || "");

	const serverIrys = new Irys({
		//@ts-ignore
		network, // mainnet || devnet
		token, // Token used for payment and signing
		key: key,
		config: { providerUrl }, // Optional provider URL, only required when using Devnet
	});
	console.log(
		"serverIrysPubKey",
		//@ts-ignore
		serverIrys.tokenConfig.getPublicKey().toJSON(),
	);

	const price = await serverIrys.getPrice(parseInt(filesize));
	const balance = await serverIrys.getLoadedBalance();

	let fundTx;
	if (price.isGreaterThanOrEqualTo(balance)) {
		console.log("Funding node.");
		fundTx = await serverIrys.fund(price);
		console.log("Successfully funded fundTx=", fundTx);
	} else {
		console.log("Funding not needed, balance sufficient.");
	}

	// return the transaction id
	return fundTx?.id || "";
}

async function readFromStream(stream: ReadableStream<Uint8Array> | null): Promise<string> {
	if (!stream) return "";
	const reader = stream.getReader();
	let result = "";

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		result += new TextDecoder().decode(value);
	}

	return result;
}

export async function POST(req: Request) {
	//@ts-ignore
	const rawData = await readFromStream(req.body as ReadableStream<Uint8Array> | null);

	const body = JSON.parse(rawData);
	const fundTx = await lazyFund(body);

	return NextResponse.json({ txResult: fundTx });
}

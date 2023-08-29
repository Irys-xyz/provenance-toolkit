import Bundlr from "@bundlr-network/client";
import getRpcUrl from "@/app/utils/getRpcUrl";
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
	const currency = process.env.NEXT_PUBLIC_CURRENCY;
	const url = process.env.NEXT_PUBLIC_NODE;
	const providerUrl = getRpcUrl(currency || "");

	const serverBundlr = new Bundlr(
		//@ts-ignore
		url,
		currency,
		key,
		providerUrl ? { providerUrl } : {},
	);
	console.log(
		"serverBundlrPubKey",
		//@ts-ignore
		serverBundlr.currencyConfig.getPublicKey().toJSON(),
	);

	const price = await serverBundlr.getPrice(parseInt(filesize));
	const balance = await serverBundlr.getLoadedBalance();

	let fundTx;
	if (price.isGreaterThanOrEqualTo(balance)) {
		console.log("Funding node.");
		fundTx = await serverBundlr.fund(price);
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

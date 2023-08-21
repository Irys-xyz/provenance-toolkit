import { WebBundlr } from "@bundlr-network/client";
import fileReaderStream from "filereader-stream";
import getBundlr from "./getBundlr";

// Define the Tag type
type Tag = {
	name: string;
	value: string;
};

/**
 * Uploads the selected file and tags after funding if necessary.
 *
 * @param {File} selectedFile - The file to be uploaded.
 * @param {Tag[]} tags - An array of tags associated with the file.
 * @returns {Promise<string>} - The transaction ID of the upload.
 */
const gasslessFundAndUpload = async (selectedFile: File, tags: Tag[]): Promise<string> => {
	// obtain the server's public key
	const pubKeyRes = (await (await fetch("/api/publicKey")).json()) as unknown as {
		pubKey: string;
	};
	const pubKey = Buffer.from(pubKeyRes.pubKey, "hex");
	console.log("pubKey=", pubKey);

	// create a provider - this mimics the behaviour of the injected provider, i.e metamask
	const provider = {
		// for ETH wallets
		getPublicKey: async () => {
			return pubKey;
		},
		getSigner: () => {
			return {
				getAddress: () => pubKey, // pubkey is address for TypedEthereumSigner
				_signTypedData: async (
					_domain: never,
					_types: never,
					message: { address: string; "Transaction hash": Uint8Array },
				) => {
					const convertedMsg = Buffer.from(message["Transaction hash"]).toString("hex");
					console.log("convertedMsg: ", convertedMsg);
					const res = await fetch("/api/signData", {
						method: "POST",
						body: JSON.stringify({ signatureData: convertedMsg }),
					});
					const { signature } = await res.json();
					const bSig = Buffer.from(signature, "hex");
					// Pad & convert so it's in the format the signer expects to have to convert from.
					const pad = Buffer.concat([Buffer.from([0]), Buffer.from(bSig)]).toString("hex");
					return pad;
				},
			};
		},

		_ready: () => {},
	};
	console.log("provider.getSigner()=", provider.getSigner());

	// if your app is lazy-funding uploads, this next section
	// can be used. alternatively you can delete this section and
	// do a bulk up-front funding of a node.

	// 1. first create the datastream and get the size
	const dataStream = fileReaderStream(selectedFile);
	console.log("Calling fund");

	// 2. then pass the size to the lazyFund API route
	console.log("pre /api/lazyFund");
	const fundTx = await fetch("/api/lazyFund", {
		method: "POST",
		body: dataStream.size.toString(),
	});

	console.log("Post /api/lazyFund");

	// Create a new WebBundlr object using the provider created with server info.
	const bundlr = new WebBundlr("https://devnet.bundlr.network", "matic", provider);
	await bundlr.ready();
	console.log("bundlr.ready()=", bundlr);

	console.log("Uploading...");
	const tx = await bundlr.uploadWithReceipt(dataStream, {
		tags,
	});
	console.log("Uploaded: ", tx.id);

	return tx.id;
};

export default gasslessFundAndUpload;

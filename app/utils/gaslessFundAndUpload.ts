import { WebIrys } from "@irys/sdk";
import getIrys from "./getIrys";

// Define the Tag type
type Tag = {
	name: string;
	value: string;
};

const GATEWAY_BASE = (process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/").endsWith("/")
	? process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/"
	: (process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/") + "/";

// Function Overloading
async function gaslessFundAndUpload(file: File, tags: Tag[]): Promise<string>;
async function gaslessFundAndUpload(files: File[], tags: Tag[]): Promise<string[]>;
async function gaslessFundAndUpload(files: File | File[], tags: Tag[]): Promise<string | string[]> {
	if (Array.isArray(files)) {
		return await gaslessFundAndUploadMultipleFiles(files, tags);
	} else {
		return await gaslessFundAndUploadSingleFile(files, tags);
	}
}
/**
 * Uploads the selected file and tags after funding if necessary.
 *
 * @param {File} selectedFile - The file to be uploaded.
 * @param {Tag[]} tags - An array of tags associated with the file.
 * @returns {Promise<string>} - The transaction ID of the upload.
 */
const gaslessFundAndUploadSingleFile = async (selectedFile: File, tags: Tag[]): Promise<string> => {
	// obtain the server's public key
	const pubKeyRes = (await (await fetch("/api/publicKey")).json()) as unknown as {
		pubKey: string;
	};
	const pubKey = Buffer.from(pubKeyRes.pubKey, "hex");

	// Create a provider - this mimics the behaviour of the injected provider, i.e metamask
	const provider = {
		// for ETH wallets
		getPublicKey: async () => {
			return pubKey;
		},
		getSigner: () => {
			return {
				getAddress: () => pubKey.toString(), // pubkey is address for TypedEthereumSigner
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

	// You can delete the lazyFund route if you're prefunding all uploads
	const fundTx = await fetch("/api/lazyFund", {
		method: "POST",
		body: selectedFile.size.toString(),
	});

	// Create a new WebIrys object using the provider created with server info.
	const network = process.env.NEXT_PUBLIC_NETWORK || "devnet";
	const token = process.env.NEXT_PUBLIC_TOKEN || "";

	const wallet = { name: "ethersv5", provider: provider };
	//@ts-ignore
	const irys = new WebIrys({ network, token, wallet });

	const w3signer = await provider.getSigner();
	const address = (await w3signer.getAddress()).toLowerCase();
	await irys.ready();

	console.log("Uploading irys=", irys);
	const tx = await irys.uploadFile(selectedFile, {
		tags,
	});
	console.log(`Uploaded successfully. https://gateway.irys.xyz/${tx.id}`);

	return tx.id;
};

/**
 * Uploads the selected file and tags after funding if necessary.
 *
 * @param {File} selectedFile - The file to be uploaded.
 * @param {Tag[]} tags - An array of tags associated with the file.
 * @returns {Promise<string>} - The transaction ID of the upload.
 */
const gaslessFundAndUploadMultipleFiles = async (files: File[], tags: Tag[]): Promise<string[]> => {
	// obtain the server's public key
	const pubKeyRes = (await (await fetch("/api/publicKey")).json()) as unknown as {
		pubKey: string;
	};
	const pubKey = Buffer.from(pubKeyRes.pubKey, "hex");
	// Create a provider - this mimics the behaviour of the injected provider, i.e metamask
	const provider = {
		// for ETH wallets
		getPublicKey: async () => {
			return pubKey;
		},
		getSigner: () => {
			return {
				getAddress: () => pubKey.toString(), // pubkey is address for TypedEthereumSigner
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

	const totalSize = files.reduce((total, file) => total + file.size, 0);
	console.log("totalSize=", totalSize);
	// You can delete the lazyFund route if you're prefunding all uploads
	const fundTx = await fetch("/api/lazyFund", {
		method: "POST",
		body: totalSize.toString(),
	});

	// Create a new WebIrys object using the provider created with server info.
	const network = process.env.NEXT_PUBLIC_NETWORK || "devnet";
	const token = process.env.NEXT_PUBLIC_TOKEN || "";

	const wallet = { name: "ethersv5", provider: provider };
	//@ts-ignore
	const irys = new WebIrys({ network, token, wallet });

	const w3signer = await provider.getSigner();
	const address = (await w3signer.getAddress()).toLowerCase();
	await irys.ready();

	const receipt = await irys.uploadFolder(files, {
		//@ts-ignore
		tags,
	});
	console.log("folder uploaded ", receipt);
	console.log(`Uploaded successfully. ${GATEWAY_BASE}${receipt.manifestId}`);

	return [receipt?.manifestId || "", receipt?.id || ""];
};

export { gaslessFundAndUpload };

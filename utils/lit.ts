import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { WebIrys } from "@irys/sdk";
import getIrys from "./getIrys";

type Tag = {
	name: string;
	value: string;
};

import { AccessControlConditions, ILitNodeClient } from "@lit-protocol/types";

// Get the URL of the Irys gateway this instance is configured to use
// Ensure it has a trailing slash
const GATEWAY_BASE = (process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/").endsWith("/")
	? process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/"
	: (process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/") + "/";

const encryptFile = async (file: File) => {
	// 1. Connect to a Lit node
	const litNodeClient = new LitJsSdk.LitNodeClient({
		litNetwork: "cayenne",
		debug: false,
	});
	await litNodeClient.connect();

	// // 2. Ensure we have a wallet signature
	const authSig = await LitJsSdk.checkAndSignAuthMessage({
		chain: process.env.NEXT_PUBLIC_LIT_CHAIN || "polygon",
		nonce: litNodeClient.getLatestBlockhash(),
	});

	// 3. Define access control conditions.
	// This defines who can decrypt, current settings allow for
	// anyone with a ETH balance >= 0 to decrypt, which
	// means that anyone can. This is for demo purposes.
	const accessControlConditions: AccessControlConditions = [
		{
			contractAddress: "",
			standardContractType: "",
			chain: "ethereum",
			method: "eth_getBalance",
			parameters: [":userAddress", "latest"],
			returnValueTest: {
				comparator: ">=",
				value: "0",
			},
		},
	];

	// 4. Create a zip blob containing the encrypted file and associated metadata
	const zipBlob = await LitJsSdk.encryptFileAndZipWithMetadata({
		chain: process.env.NEXT_PUBLIC_LIT_CHAIN || "polygon",
		authSig,
		accessControlConditions,
		file,
		//@ts-ignore
		litNodeClient,
		readme: "This file was encrypted using LitProtocol and the Irys Provenance Toolkit.",
	});

	return zipBlob;
};

// Uploads the encrypted File (with metadata) to Irys
const uploadFile = async (file: File): Promise<string> => {
	const irys = await getIrys();
	try {
		const price = await irys.getPrice(file?.size);
		const balance = await irys.getLoadedBalance();

		if (price.isGreaterThanOrEqualTo(balance)) {
			console.log("Funding node.");
			await irys.fund(price);
		} else {
			console.log("Funding not needed, balance sufficient.");
		}

		// Tag the upload marking it as
		// - Binary file
		// - Containing a file of type file.type (used when displaying)
		// - Encrypted (used by our display code)
		const tags: Tag[] = [
			{
				name: "Content-Type",
				value: "application/octet-stream",
			},
			{
				name: "Encrypted-File-Content-Type",
				value: file.type,
			},
			{
				name: "Irys-Encrypted",
				value: "true",
			},
		];

		const receipt = await irys.uploadFile(file, {
			tags,
		});
		console.log(`Uploaded successfully. ${GATEWAY_BASE}${receipt.id}`);

		return receipt.id;
	} catch (e) {
		console.log("Error uploading single file ", e);
	}
	return "";
};

// Encrypts and then uploads a File
const encryptAndUploadFile = async (file: File): Promise<string> => {
	const encryptedData = await encryptFile(file);
	return await uploadFile(encryptedData!);
};

// Helper functions for use in showing decrypted images
const arrayBufferToBlob = (buffer: ArrayBuffer, type: string): Blob => {
	return new Blob([buffer], { type: type });
};

const blobToDataURL = (blob: Blob): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (event) => {
			if (event.target?.result) {
				resolve(event.target.result as string);
			} else {
				reject(new Error("Failed to read blob as Data URL"));
			}
		};
		reader.readAsDataURL(blob);
	});
};

const decryptFile = async (id: string, encryptedFileType: string): Promise<string> => {
	try {
		// 1. Retrieve the file from https://gateway.irys.xyz/${id}
		const response = await fetch(`${GATEWAY_BASE}${id}`);
		if (!response.ok) {
			throw new Error(`Failed to fetch encrypted file from gateway with ID: ${id}`);
		}

		// 2. Extract the zipBlob
		const zipBlob = await response.blob();

		// 3. Connect to a Lit node
		const litNodeClient = new LitJsSdk.LitNodeClient({
			litNetwork: "cayenne",
			debug: false,
		});
		await litNodeClient.connect();

		// 3.5 You might need to get authSig or sessionSigs here if required
		const authSig = await LitJsSdk.checkAndSignAuthMessage({
			chain: process.env.NEXT_PUBLIC_LIT_CHAIN || "polygon",
			nonce: litNodeClient.getLatestBlockhash(),
		});

		// 4. Decrypt the zipBlob
		const result = await LitJsSdk.decryptZipFileWithMetadata({
			file: zipBlob,
			//@ts-ignore
			litNodeClient,
			authSig,
		});
		// @ts-ignore
		const decryptedFile = result.decryptedFile;
		// 5. Convert to a blob
		const blob = arrayBufferToBlob(decryptedFile, encryptedFileType);
		// 6. Build a dynamic URL
		const dataUrl = await blobToDataURL(blob);

		return dataUrl;
	} catch (e) {
		console.error("Error decrypting file:", e);
	}
	return "";
};

export { encryptAndUploadFile, decryptFile };

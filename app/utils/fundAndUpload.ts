import { WebBundlr } from "@bundlr-network/client";
import fileReaderStream from "filereader-stream";
import getBundlr from "../utils/getBundlr";

// Define the Tag type
type Tag = {
	name: string;
	value: string;
};

/**
 * Uploads the selected folder and tags after funding if necessary.
 *
 * @param {File} selectedFile - The file to be uploaded.
 * @param {Tag[]} tags - An array of tags associated with the file.
 * @returns {Promise<string>} - The transaction ID of the upload.
 */
// const fundAndUpload = async (file: File, tags: Tag[]): Promise<string> => {
async function fundAndUploadFolder(files: File[], tags: Tag[]): Promise<string[]> {
	const bundlr = await getBundlr();

	try {
		const fileCount = files.length;
		let totalBytes = 0;
		for (const file of files) {
			totalBytes += file.size;
		}

		// Get the total size of all files in the folder
		const price = await bundlr.utils.estimateFolderPrice({ fileCount, totalBytes });
		const balance = await bundlr.getLoadedBalance();
		console.log(
			`Cost to upload ${fileCount} files containing ${totalBytes} bytes is ${bundlr.utils.fromAtomic(price)}`,
		);

		if (price.isGreaterThanOrEqualTo(balance)) {
			console.log("Funding node.");
			await bundlr.fund(price);
		} else {
			console.log("Funding not needed, balance sufficient.");
		}

		console.log("Uploading folder...");
		console.log(files);
		const tx = await bundlr.uploadFolder(files, {
			getReceiptSignature: true,
		});
		console.log("tx:", tx);

		const manifestId = tx?.manifestId;
		const receiptId = tx?.id;
		console.log("manifestId=", manifestId);
		console.log("receiptId=", receiptId);

		console.log(`Uploaded successfully. https://arweave.net/${manifestId}`);
		//@ts-ignore
		return [manifestId, receiptId];
	} catch (e) {
		console.log("Error on upload:", e);
	}
	return ["", ""];
}

/**
 * Checks the cost to upload a file, funds if needed and finally uploads.
 *
 * @param file A file to upload
 * @param tags Tags to attach to the file
 * @returns
 */
async function fundAndUploadFile(file: File, tags: Tag[]): Promise<string> {
	const bundlr = await getBundlr();

	try {
		const dataStream = fileReaderStream(file);
		const price = await bundlr.getPrice(file?.size);
		const balance = await bundlr.getLoadedBalance();

		if (price.isGreaterThanOrEqualTo(balance)) {
			console.log("Funding node.");
			await bundlr.fund(price);
		} else {
			console.log("Funding not needed, balance sufficient.");
		}

		console.log("Uploading...");
		const tx = await bundlr.uploadWithReceipt(dataStream, {
			tags,
		});
		console.log(`Uploaded successfully. https://arweave.net/${tx.id}`);

		return tx.id;
	} catch (e) {
		console.log("Error on upload:", e);
	}

	// Ends up getting called ONLY if an error is thrown
	return "";
}

export { fundAndUploadFolder, fundAndUploadFile };

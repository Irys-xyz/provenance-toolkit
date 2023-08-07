import { WebBundlr } from "@bundlr-network/client";
import fileReaderStream from "filereader-stream";
import getBundlr from "../utils/getBundlr";

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
const fundAndUpload = async (selectedFile: File, tags: Tag[]): Promise<string> => {
	try {
		const bundlr = await getBundlr();

		const dataStream = fileReaderStream(selectedFile);
		const price = await bundlr.getPrice(selectedFile?.size);
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
		console.log("Uploaded successfully.");

		return tx.id;
	} catch (e) {
		console.log("Error on upload:", e);
	}

	// Ends up getting called ONLY if an error is thrown
	return "";
};

export default fundAndUpload;

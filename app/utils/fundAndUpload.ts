import { WebIrys } from "@irys/sdk";
import fileReaderStream from "filereader-stream";
import getIrys from "../utils/getIrys";

type Tag = {
	name: string;
	value: string;
};

// Function Overloading
async function fundAndUpload(file: File, tags: Tag[]): Promise<string>;
async function fundAndUpload(files: File[], tags: Tag[]): Promise<string[]>;
async function fundAndUpload(files: File | File[], tags: Tag[]): Promise<string | string[]> {
	if (Array.isArray(files)) {
		return await fundAndUploadMultipleFiles(files, tags);
	} else {
		return await fundAndUploadSingleFile(files, tags);
	}
}

async function fundAndUploadMultipleFiles(files: File[], tags: Tag[]): Promise<string[]> {
	const irys = await getIrys();

	try {
		let size = 0;
		for (const file of files) {
			size += file.size;
		}
		const price = await irys.getPrice(size);
		const balance = await irys.getLoadedBalance();

		if (price.isGreaterThanOrEqualTo(balance)) {
			console.log("Funding node.");
			await irys.fund(price);
		} else {
			console.log("Funding not needed, balance sufficient.");
		}

		const receipt = await irys.uploadFolder(files, {
			tags,
		});
		console.log("folder uploaded ", receipt);
		console.log(`Uploaded successfully. https://arweave.net/${receipt.manifestId}`);

		return [receipt.manifestId, receipt.id];
	} catch (e) {
		console.log("Error uploading single file ", e);
	}
	return ["", ""];
}

async function fundAndUploadSingleFile(file: File, tags: Tag[]): Promise<string> {
	const irys = await getIrys();

	try {
		const dataStream = fileReaderStream(file);
		const price = await irys.getPrice(file?.size);
		const balance = await irys.getLoadedBalance();

		if (price.isGreaterThanOrEqualTo(balance)) {
			console.log("Funding node.");
			await irys.fund(price);
		} else {
			console.log("Funding not needed, balance sufficient.");
		}

		const receipt = await irys.upload(dataStream, {
			tags,
		});
		console.log(`Uploaded successfully. https://arweave.net/${receipt.id}`);

		return receipt.id;
	} catch (e) {
		console.log("Error uploading single file ", e);
	}
	return "";
}

export { fundAndUpload };

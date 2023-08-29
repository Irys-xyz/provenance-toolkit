import { WebBundlr } from "@bundlr-network/client";
import fileReaderStream from "filereader-stream";
import getBundlr from "./getBundlr";
import type { DataItem, Bundle } from "arbundles";
import { createData, ArweaveSigner, bundleAndSignData } from "arbundles";
import Arweave from "arweave";

// Define the Tag type
type Tag = {
	name: string;
	value: string;
};

/**
 * Prepares the files for uploading by creating DataItems.
 *
 * @param {File[]} files - The files to be uploaded.
 * @param {ArweaveSigner} ephemeralSigner - The Arweave signer used for signing the data items.
 * @returns {Promise<Map<string, DataItem>>} - A map containing file names as keys and DataItems as values.
 */
async function prepareFiles(files: File[], ephemeralSigner: ArweaveSigner): Promise<Map<string, DataItem>> {
	const items: [string, DataItem][] = await Promise.all(
		files.map(async (file) => {
			return [file.name, await prepareFile(file, ephemeralSigner)];
		}),
	);
	return new Map(items);
}

/**
 * Prepares an individual file for uploading by creating a DataItem.
 *
 * @param {File} file - The file to be prepared.
 * @param {ArweaveSigner} ephemeralSigner - The Arweave signer used for signing the data item.
 * @returns {Promise<DataItem>} - The prepared DataItem.
 */
async function prepareFile(file: File, ephemeralSigner: ArweaveSigner): Promise<DataItem> {
	const item = createData(new Uint8Array(await file.arrayBuffer()), ephemeralSigner, {
		tags: [{ name: "Content-Type", value: file.type }],
	});
	await item.sign(ephemeralSigner);
	return item;
}

/**
 * Bundles the prepared DataItems and creates a manifest.
 *
 * @param {Map<string, DataItem>} itemMap - The map containing file names as keys and DataItems as values.
 * @param {ArweaveSigner} ephemeralSigner - The Arweave signer used for signing the bundle.
 * @returns {Promise<Bundle>} - The bundled data.
 */
async function bundleItems(itemMap: Map<string, DataItem>, ephemeralSigner: ArweaveSigner): Promise<Bundle> {
	const bundlr = await getBundlr();

	const pathMap = new Map<string, string>([...itemMap].map(([path, item]) => [path, item.id]));
	const manifest = await bundlr.uploader.generateManifest({ items: pathMap });
	const manifestItem = await createData(JSON.stringify(manifest), ephemeralSigner, {
		tags: [
			{ name: "Type", value: "manifest" },
			{ name: "Content-Type", value: "application/x.arweave-manifest+json" },
		],
	});
	const bundle = await bundleAndSignData([...itemMap.values(), manifestItem], ephemeralSigner);
	return bundle;
}

/**
 * Uploads the bundled data to the Bundlr network.
 *
 * @param {Bundle} bundle - The bundle to be uploaded.
 * @returns {Promise<string>} - The transaction ID of the upload.
 */
async function uploadBundle(bundle: Bundle): Promise<string[]> {
	const bundlr = await getBundlr();

	const tx = bundlr.createTransaction(bundle.getRaw(), {
		tags: [
			{ name: "Bundle-Format", value: "binary" },
			{ name: "Bundle-Version", value: "2.0.0" },
		],
	});
	await tx.sign();
	const res = await tx.uploadWithReceipt();
	const manifestId = bundle.items[bundle.items.length - 1].id;
	//   console.log(`Manifest ID: ${manifestId}`);
	return [manifestId, res.id];
}

/**
 * Uploads multiple files as a nested bundle.
 *
 * @param {File[]} files - The files to be uploaded.
 * @returns {Promise<string>} - The transaction ID of the upload.
 */
const fundAndUploadNestedBundle = async (files: File[]): Promise<string[]> => {
	try {
		const ephemeralSigner = new ArweaveSigner(await Arweave.crypto.generateJWK());
		const preppedFiles = await prepareFiles(files, ephemeralSigner);
		const bundle = await bundleItems(preppedFiles, ephemeralSigner);
		const [manifestId, receiptId] = await uploadBundle(bundle);
		return [manifestId, receiptId];
	} catch (e) {
		console.log("Error on upload:", e);
	}

	// Ends up getting called ONLY if an error is thrown
	return ["", ""];
};

export default fundAndUploadNestedBundle;

"use client";

import Button from "./Button";
import JSONView from "react-json-view";
import Spinner from "./Spinner";
import Switch from "react-switch";
import fileReaderStream from "filereader-stream";
import fundAndUpload from "../utils/fundAndUpload";
import fundAndUploadNestedBundle from "../utils/fundAndUploadNestedBundle";
import getBundlr from "../utils/getBundlr";
import { useCallback } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { useRef } from "react";
import { useState } from "react";
import { WebBundlr } from "@bundlr-network/client";

// Define the Tag type
type Tag = {
	name: string;
	value: string;
};

interface FileWrapper {
	file: File;
	isUploaded: boolean;
	id: string;
	previewUrl: string;
}

export const GasslessUploader: React.FC = () => {
	const [files, setFiles] = useState<FileWrapper[]>([]);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewURL, setPreviewURL] = useState<string>("");
	const [receipt, setReceipt] = useState<string>("");
	const [receiptQueryProcessing, setReceiptQueryProcessing] = useState<boolean>(false);
	const [txProcessing, setTxProcessing] = useState(false);
	const [message, setMessage] = useState<string>("");
	const GATEWAY_BASE = "https://arweave.net/"; // Set to the base URL of any gateway

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const files = Array.from(event.target.files);
			const newUploadedFiles: FileWrapper[] = files.map((file) => ({
				file,
				isUploaded: false,
				id: "",
				previewUrl: "",
			}));
			setFiles(newUploadedFiles);
		}
	};

	/**
	 * Called when a user clicks the "Upload" button
	 */
	const gasslessUpload = async () => {
		setMessage("");
		if (!files || files.length === 0) {
			setMessage("Please select a file first");
			return;
		}
		setTxProcessing(true);

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
		const dataStream = fileReaderStream(files[0].file);
		console.log("Calling fund");

		// 2. then pass the size to the lazyFund API route
		const fundTx = await fetch("/api/lazyFund", {
			method: "POST",
			body: dataStream.size.toString(),
		});

		console.log("Funding successful fundTx=", fundTx);

		// Create a new WebBundlr object using the provider created with server info.
		const bundlr = new WebBundlr("https://devnet.bundlr.network", "matic", provider);
		await bundlr.ready();
		console.log("bundlr.ready()=", bundlr);

		const tags: Tag[] = [{ name: "Content-Type", value: files[0].file.type }];
		console.log("Uploading...");
		const tx = await bundlr.uploadWithReceipt(dataStream, {
			tags,
		});

		// and share the results
		console.log(`File uploaded ==> https://arweave.net/${tx.id}`);
		files[0].id = tx.id;
		files[0].isUploaded = true;
		files[0].previewUrl = GATEWAY_BASE + tx.id;
		setTxProcessing(false);
	};

	const resetFilesAndOpenFileDialog = useCallback(() => {
		setFiles([]);
		const input = document.querySelector('input[type="file"]');
		if (input) {
			input.click();
		}
	}, []);

	const handleUpload = async () => {
		setMessage("");
		if (!files || files.length === 0) {
			setMessage("Please select a file first");
			return;
		}
		setTxProcessing(true);
		const bundlr = await getBundlr();

		// If more than one file is selected, then all files are wrapped together and uploaded in a single tx
		if (files.length > 1) {
			// Remove the File objects from the FileWrapper objects
			const filesToUpload: File[] = files.map((file) => file.file);
			console.log("Multi-file upload");
			const manifestId = await fundAndUploadNestedBundle(filesToUpload);

			// Now that the upload is done, update the FileWrapper objects with the preview URL
			const updatedFiles = files.map((file) => ({
				...file,
				isUploaded: true,
				previewUrl: GATEWAY_BASE + manifestId + "/" + file.file.name,
			}));
			setFiles(updatedFiles);
		} else {
			console.log("Single file upload");
			// This occurs when exactly one file is selected
			try {
				for (const file of files) {
					const tags: Tag[] = [{ name: "Content-Type", value: file.file.type }];
					const uploadedTx = await fundAndUpload(file.file, tags);
					file.id = uploadedTx;
					file.isUploaded = true;
					file.previewUrl = GATEWAY_BASE + uploadedTx;
				}
			} catch (e) {
				console.log("Error on upload: ", e);
			}
		}
		setTxProcessing(false);
	};

	const showReceipt = async (id: string) => {
		setReceiptQueryProcessing(true);
		try {
			const bundlr = await getBundlr();
			const receipt = await bundlr.utils.getReceipt(id);
			setReceipt(receipt);
			setPreviewURL(""); // Only show one or the other
		} catch (e) {
			console.log("Error fetching receipt: " + e);
		}
		setReceiptQueryProcessing(false);
	};

	// Display only the last selected file's preview.
	const memoizedPreviewURL = useMemo(() => {
		if (previewURL) {
			return (
				<div>
					<img
						className="w-full h-full rounded-xl resize-none bg-primary object-cover"
						src={previewURL}
						alt="Thumbnail"
					/>
				</div>
			);
		}
		return null;
	}, [previewURL]);

	// Display only the receipt JSON when available.
	const memoizedReceiptView = useMemo(() => {
		if (receipt && !previewURL) {
			return (
				<div className="w-full">
					<JSONView
						src={receipt}
						name={null}
						enableClipboard={false}
						displayDataTypes={false}
						displayObjectSize={false}
						collapsed={false}
						style={{ fontSize: 14 }}
					/>
				</div>
			);
		}
		return null;
	}, [receipt, previewURL]);

	return (
		<div
			className={`mt-10 bg-white rounded-lg border shadow-2xl  mx-auto w-full sm:w-4/5 
			${memoizedPreviewURL && memoizedReceiptView ? "max-w-7xl" : "max-w-sm"}
		`}
		>
			{/* <h2 className="text-3xl text-center mt-3 font-bold mb-4 font-main">Bundlr Multi-File Uploader</h2> */}
			<div className="flex p-5">
				<div className={`space-y-6 ${memoizedPreviewURL && memoizedReceiptView ? "w-1/2" : "w-full"}`}>
					<div
						className="border-2 border-dashed bg-primary border-background-contrast rounded-lg p-4 text-center"
						onDragOver={(event) => event.preventDefault()}
						onDrop={(event) => {
							event.preventDefault();
							const droppedFiles = Array.from(event.dataTransfer.files);
							const newUploadedFiles: FileWrapper[] = droppedFiles.map((file) => ({
								file,
								isUploaded: false,
								id: "",
								previewUrl: "",
							}));
							setFiles(newUploadedFiles);
						}}
					>
						<p className="text-gray-400 mb-2">Drag and drop files here</p>
						<input type="file" multiple onChange={handleFileUpload} className="hidden" />
						<button
							onClick={resetFilesAndOpenFileDialog}
							className={`w-full min-w-full py-2 px-4 bg-primary text-text font-bold rounded-md flex items-center justify-center transition-colors duration-500 ease-in-out  ${
								txProcessing
									? "bg-background-contrast text-white cursor-not-allowed"
									: "hover:bg-background-contrast hover:text-white"
							}`}
							disabled={txProcessing}
						>
							{txProcessing ? <Spinner color="text-background" /> : "Browse Files"}
						</button>
					</div>
					{files.length > 0 && (
						<div className="flex flex-col space-y-2">
							{files.map((file, index) => (
								<div key={index} className="flex items-center justify-start mb-2">
									<span className="mr-2 text-text">{file.file.name}</span>
									{file.isUploaded && (
										<>
											<span className="mr-2">
												<button
													className="px-1 w-18 h-7 font-xs bg-background text-text rounded-md flex items-center justify-center transition-colors duration-500 ease-in-out border-2 border-background-contrast hover:bg-background-contrast hover:text-white"
													onClick={() => setPreviewURL(file.previewUrl)}
												>
													File --&gt;
												</button>
											</span>
											<span className="mr-2">
												<button
													className="px-1 w-24 h-7 font-xs bg-background text-text rounded-md flex items-center justify-center transition-colors duration-500 ease-in-out border-2 border-background-contrast hover:bg-background-contrast hover:text-white"
													onClick={() => showReceipt(file.id)}
												>
													{receiptQueryProcessing ? (
														<Spinner color="text-background" />
													) : (
														"Receipt -->"
													)}
												</button>
											</span>
										</>
									)}
								</div>
							))}
						</div>
					)}

					<Button onClick={gasslessUpload} disabled={txProcessing}>
						{txProcessing ? <Spinner color="text-background" /> : "Upload"}
					</Button>
				</div>
				{memoizedPreviewURL && memoizedReceiptView && (
					<div className="w-1/2 h-96 flex justify-center space-y-4 bg-primary rounded-xl overflow-auto">
						{memoizedPreviewURL}
						{memoizedReceiptView}
					</div>
				)}
			</div>
		</div>
	);
};

export default GasslessUploader;

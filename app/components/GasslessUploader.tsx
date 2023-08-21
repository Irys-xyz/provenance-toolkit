"use client";

import Button from "./Button";
import JSONView from "react-json-view";
import Spinner from "./Spinner";
import Switch from "react-switch";
import fileReaderStream from "filereader-stream";
import gasslessFundAndUpload from "../utils/gasslessFundAndUpload";
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

		const tags: Tag[] = [{ name: "Content-Type", value: files[0].file.type }];
		const uploadTxId = await gasslessFundAndUpload(files[0].file, tags);

		console.log(`File uploaded ==> https://arweave.net/${uploadTxId}`);
		files[0].id = uploadTxId;
		files[0].isUploaded = true;
		files[0].previewUrl = GATEWAY_BASE + uploadTxId;
		setTxProcessing(false);
	};

	const resetFilesAndOpenFileDialog = useCallback(() => {
		setFiles([]);
		const input = document.querySelector('input[type="file"]');
		if (input) {
			input.click();
		}
	}, []);

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

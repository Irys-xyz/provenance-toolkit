"use client";

import { useState } from "react";
import Switch from "react-switch";
import Spinner from "./Spinner";
import { useEffect } from "react";
import { useMemo } from "react";
import { useRef } from "react";
import { useCallback } from "react";
import getBundlr from "../utils/getBundlr";
import fileReaderStream from "filereader-stream";
import JSONView from "react-json-view";
import fundAndUpload from "../utils/fundAndUpload";
import fundAndUploadNestedBundle from "../utils/fundAndUploadNestedBundle";

// Define the Tag type
type Tag = {
	name: string;
	value: string;
};

interface FileWrapper {
	file: File;
	isUploaded: boolean;
	id: String;
	previewUrl: string;
}

export const Uploader: React.FC = () => {
	const [files, setFiles] = useState<FileWrapper[]>([]);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewURL, setPreviewURL] = useState<string>("");
	const [receipt, setReceipt] = useState<string>("");
	const [receiptQueryProcessing, setReceiptQueryProcessing] = useState<boolean>(false);
	const [isNestedBundle, setIsNestedBundle] = useState(false);
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

	const handleIsNestedBundleChange = (checked: boolean) => {
		setIsNestedBundle(checked);
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

		// If isNestedBundle is true, then all files are wrapped together and uploaded in a single tx
		if (isNestedBundle) {
			// Remove the File objects from the FileWrapper objects
			const filesToUpload: File[] = files.map((file) => file.file);
			console.log("Nested bundle upload");
			const manifestId = await fundAndUploadNestedBundle(filesToUpload);

			// Now that the upload is done, update the FileWrapper objects with the preview URL
			const updatedFiles = files.map((file) => ({
				...file,
				isUploaded: true,
				previewUrl: GATEWAY_BASE + manifestId + "/" + file.file.name,
			}));
			setFiles(updatedFiles);
		} else {
			// If isNestedBundle is false, each file is uploaded as a separate tx
			try {
				for (const file of files) {
					const tags: Tag[] = [{ name: "Content-Type", value: file.file.type }];
					const uploadedTx = await fundAndUpload(file.file, tags);
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
		<div className="mt-10 bg-background rounded-lg shadow-2xl max-w-7xl mx-auto w-full sm:w-4/5">
			<h2 className="text-3xl text-center mt-3 font-bold mb-4 font-main">Bundlr Multi-File Uploader</h2>
			<div className="flex p-5">
				<div className="w-1/2 pr-4 space-y-4">
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
					<div className="flex items-center justify-start mb-2 mt-5">
						<Switch
							onChange={handleIsNestedBundleChange}
							checked={isNestedBundle}
							onColor="#81b0ff"
							offColor="#767577"
							checkedIcon={false}
							uncheckedIcon={false}
						/>
						<span className="ml-2 text-lg text-text font-xs">
							Nested Bundle {isNestedBundle ? "On" : "Off"}
						</span>
					</div>
					<button
						className={`w-full py-2 px-4 bg-background text-text rounded-md flex items-center justify-center transition-colors duration-500 ease-in-out border-2 border-background-contrast ${
							txProcessing
								? "bg-background-contrast text-white cursor-not-allowed"
								: "hover:bg-background-contrast hover:text-white"
						}`}
						onClick={handleUpload}
						disabled={txProcessing}
					>
						{txProcessing ? <Spinner color="text-background" /> : "Upload"}
					</button>
				</div>
				<div className="w-1/2 h-96 flex justify-center space-y-4 bg-primary rounded-xl overflow-auto">
					{memoizedPreviewURL}
					{memoizedReceiptView}
				</div>
			</div>
		</div>
	);
};

export default Uploader;

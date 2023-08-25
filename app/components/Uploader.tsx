"use client";

import { AiOutlineFileSearch } from "react-icons/ai";
import Button from "./Button";
import { PiReceiptLight } from "react-icons/pi";
import Spinner from "./Spinner";
import Switch from "react-switch";
import ReceiptJSONView from "./ReceiptJSONView";
import fileReaderStream from "filereader-stream";
import fundAndUpload from "../utils/fundAndUpload";
import fundAndUploadNestedBundle from "../utils/fundAndUploadNestedBundle";
import getBundlr from "../utils/getBundlr";
import { useCallback } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { useRef } from "react";
import { useState } from "react";

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

export const Uploader: React.FC = () => {
	const [files, setFiles] = useState<FileWrapper[]>([]);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewURL, setPreviewURL] = useState<string>("");
	const [receipt, setReceipt] = useState<string>("");
	const [receiptQueryProcessing, setReceiptQueryProcessing] = useState<boolean>(false);
	const [txProcessing, setTxProcessing] = useState(false);
	const [message, setMessage] = useState<string>("");
	const GATEWAY_BASE = "https://arweave.net/"; // Set to the base URL of any gateway

	useEffect(() => {
		setMessage("");
	}, []);

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

	const resetFilesAndOpenFileDialog = useCallback(() => {
		setFiles([]);
		console.log("document=", document);
		const input = document?.querySelector('input[type="file"]');
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
			console.log(receipt);
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
					<ReceiptJSONView data={receipt} />
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
			<div className="flex p-5">
				<div className={`space-y-6 ${memoizedPreviewURL && memoizedReceiptView ? "w-1/2" : "w-full"}`}>
					<div
						className="border-2 border-dashed bg-[#EEF0F6]/60 border-[#EEF0F6] rounded-lg p-4 text-center"
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
							className={`w-full min-w-full py-2 px-4 bg-[#DBDEE9] text-text font-bold rounded-md flex items-center justify-center transition-colors duration-500 ease-in-out  ${
								txProcessing ? "bg-[#DBDEE9] cursor-not-allowed" : "hover:bg-[#DBDEE9] hover:font-bold"
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
											<span className="ml-auto">
												<button
													className="p-2 h-10 font-xs bg-black rounded-full text-white w-10 flex items-center justify-center transition-colors duration-500 ease-in-out hover:text-white"
													onClick={() => setPreviewURL(file.previewUrl)}
												>
													<AiOutlineFileSearch className="white-2xl" />
												</button>
											</span>
											<span className="ml-2">
												<button
													className="p-2  h-10 font-xs bg-black rounded-full text-white w-10 flex items-center justify-center transition-colors duration-500 ease-in-out hover:text-white"
													onClick={() => showReceipt(file.id)}
												>
													{receiptQueryProcessing ? (
														<Spinner color="text-background" />
													) : (
														<PiReceiptLight className="text-2xl" />
													)}
												</button>
											</span>
										</>
									)}
								</div>
							))}
						</div>
					)}

					<Button onClick={handleUpload} disabled={txProcessing}>
						{txProcessing ? <Spinner color="text-background" /> : "Upload"}
					</Button>
				</div>

				{memoizedPreviewURL && memoizedReceiptView && (
					<div className="w-1/2 h-96 flex justify-center space-y-4 bg-primary rounded-xl overflow-auto">
						This is receipt seciton
						{memoizedPreviewURL}
						{memoizedReceiptView}
					</div>
				)}
			</div>
		</div>
	);
};

export default Uploader;

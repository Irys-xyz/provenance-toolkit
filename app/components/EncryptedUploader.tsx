"use client";

import { AiOutlineFileSearch } from "react-icons/ai";
import { PiReceiptLight } from "react-icons/pi";

import MultiButton from "./MultiButton";
import ReceiptJSONView from "./ReceiptJSONView";
import Spinner from "./Spinner";
import UploadViewer from "./UploadViewer";
import fileReaderStream from "filereader-stream";
import { fundAndUpload } from "../utils/fundAndUpload";
import { gaslessFundAndUpload } from "../utils/gaslessFundAndUpload";
import { encryptAndUploadFile } from "../utils/lit";

import getIrys from "../utils/getIrys";
import { useCallback } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { useRef } from "react";
import { useState } from "react";
import getReceipt from "../utils/getReceipt";

// Define the Tag type
type Tag = {
	name: string;
	value: string;
};

interface FileWrapper {
	file: File;
	isUploaded: boolean;
	id: string;
	previewURL: string;
	loadingReceipt: boolean;
}

interface UploaderConfigProps {
	showImageView?: boolean;
	showReceiptView?: boolean;
	gasless?: boolean;
}

export const EncryptedUploader: React.FC<UploaderConfigProps> = ({
	showImageView = true,
	showReceiptView = true,
	gasless = false,
}) => {
	const [files, setFiles] = useState<FileWrapper[]>([]);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewURL, setPreviewURL] = useState<string>("");
	const [receipt, setReceipt] = useState<string>("");
	const [receiptQueryProcessing, setReceiptQueryProcessing] = useState<boolean>(false);
	const [txProcessing, setTxProcessing] = useState(false);
	const [message, setMessage] = useState<string>("");

	const GATEWAY_BASE = (process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/").endsWith("/")
		? process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/"
		: (process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/") + "/";

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
				previewURL: "",
				loadingReceipt: false,
			}));
			setFiles(newUploadedFiles);
		}
	};

	const resetFilesAndOpenFileDialog = useCallback(() => {
		setFiles([]);
		setReceipt("");
		setPreviewURL("");
		const input = document.querySelector('input[type="file"]') as HTMLInputElement;
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

		console.log("calling encryptAndUploadFile files[0]=", files[0]);
		const uploadedTx = await encryptAndUploadFile(files[0].file);
		files[0].id = uploadedTx;
		files[0].isUploaded = true;
		files[0].previewURL = uploadedTx;

		setTxProcessing(false);
	};

	const showReceipt = async (fileIndex: number, receiptId: string) => {
		let updatedFiles = [...files];
		updatedFiles[fileIndex].loadingReceipt = true;
		setFiles(updatedFiles);
		try {
			const receipt = await getReceipt(receiptId);
			setReceipt(JSON.stringify(receipt));
			setPreviewURL(""); // Only show one or the other
		} catch (e) {
			console.log("Error fetching receipt: " + e);
		}
		// For some reason we need to reset updatedFiles, probably a React state timing thing.
		updatedFiles = [...files];
		updatedFiles[fileIndex].loadingReceipt = false;
		setFiles(updatedFiles);
	};

	// Display only the last selected file's preview.
	const memoizedPreviewURL = useMemo(() => {
		if (previewURL) {
			return <UploadViewer previewURL={previewURL} checkEncrypted={true} />;
		}
		return null;
	}, [previewURL]);

	// Display only the receipt JSON when available.
	const memoizedReceiptView = useMemo(() => {
		console.log("memoizedReceiptView called");
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
		<div className={`bg-white rounded-lg border shadow-2xl mx-auto min-w-full`}>
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
								previewURL: "",
								loadingReceipt: false,
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
												{showImageView && (
													<button
														className="p-2 h-10 font-xs bg-black rounded-full text-white w-10 flex items-center justify-center transition-colors duration-500 ease-in-out hover:text-white"
														onClick={() => setPreviewURL(file.previewURL)}
													>
														<AiOutlineFileSearch className="white-2xl" />
													</button>
												)}
											</span>

											<span className="ml-2">
												{showReceiptView && (
													<button
														className="p-2 h-10 font-xs bg-black rounded-full text-white w-10 flex items-center justify-center transition-colors duration-500 ease-in-out hover:text-white"
														onClick={() => showReceipt(index, file.id)}
													>
														{file.loadingReceipt ? (
															<Spinner color="text-background" />
														) : (
															<PiReceiptLight className="text-2xl" />
														)}
													</button>
												)}
											</span>
										</>
									)}
								</div>
							))}
						</div>
					)}

					{memoizedReceiptView && (
						<div className="h-56 flex justify-center space-y-4 bg-[#EEF0F6]/60 rounded-xl overflow-auto">
							{memoizedReceiptView}
						</div>
					)}
					{memoizedPreviewURL && (
						<div className="h-56 flex justify-center space-y-4 bg-[#EEF0F6]/60 rounded-xl overflow-auto">
							{memoizedPreviewURL}
						</div>
					)}

					<MultiButton onClick={handleUpload} disabled={txProcessing} requireLitAuth={true} checkConnect={!gasless}>
						{txProcessing ? <Spinner color="text-background" /> : "Upload"}
					</MultiButton>
				</div>
			</div>
		</div>
	);
};

export default EncryptedUploader;

/*
USAGE:
- Default:
  <EncryptedUploader />

- To hide the image view button:
  <EncryptedUploader showImageView={false} />

- To hide the receipt view button:
<EncryptedUploader showReceiptView={false} />

Note:
* Default behavior is to show both image view and receipt view
*/

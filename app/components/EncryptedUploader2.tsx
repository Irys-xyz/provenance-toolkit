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

		const litNodeClient = new LitJsSdk.LitNodeClient({
			litNetwork: "cayenne",
			// debug: false,
		});
		await litNodeClient.connect();
		console.log({ litNodeClient });

		console.log("calling encryptAndUploadFile files[0]=", files[0]);
		const uploadedTx = ""; //await encryptAndUploadFile(files[0].file);
		files[0].id = uploadedTx;
		files[0].isUploaded = true;
		files[0].previewURL = uploadedTx;

		setTxProcessing(false);
	};

	return <div className={`bg-white rounded-lg border shadow-2xl mx-auto min-w-full`}>Hello</div>;
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

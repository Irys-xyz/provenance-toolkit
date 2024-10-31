"use client";

import { AiOutlineFileSearch } from "react-icons/ai";
import { PiReceiptLight } from "react-icons/pi";

import MultiButton from "./MultiButton";
import ReceiptJSONView from "./ReceiptJSONView";
import Spinner from "./Spinner";
import UploadViewer from "./UploadViewer";
import { fundAndUpload } from "../utils/fundAndUpload";
import { gaslessFundAndUpload } from "../utils/gaslessFundAndUpload";

import { useCallback } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
import getReceipt from "../utils/getReceipt";

import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { ViemV2Adapter } from "@irys/web-upload-ethereum-viem-v2";
import { Chain, createPublicClient, createWalletClient, custom } from "viem";
import {
	arbitrum,
	avalancheFuji,
	berachainTestnetbArtio,
	mainnet,
	polygon,
	lineaTestnet,
	scrollSepolia,
	iotexTestnet,
} from 'viem/chains';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { switchChain } from "viem/_types/actions/wallet/switchChain";

const NETWORKS: Chain[] = [mainnet, arbitrum, polygon, berachainTestnetbArtio, avalancheFuji, lineaTestnet, scrollSepolia, iotexTestnet];

// Define the Tag type
type Tag = {
	name: string;
	value: string;
};

interface FolderDropzoneProps {
	showImageView?: boolean;
	showReceiptView?: boolean;
	gasless?: boolean;
}


const getIrysUploader = async (chain: Chain) => {
	const [account] = await window.ethereum.request({ method: "eth_requestAccounts", });

	const provider = createWalletClient({
		account,
		chain,
		transport: custom(window.ethereum),
	});

	// Switch to the correct chain if not already on it
	try {
		const currentChain = await provider.getChainId();
		if (currentChain !== chain.id) {
			await provider.switchChain({ id: chain.id });
		}
	} catch (error) {
		console.error('Error switching chain:', error);
		throw error;
	}

	const publicClient = createPublicClient({
		chain,
		transport: custom(window.ethereum),
	});

	const irysUploader = await WebUploader(WebEthereum).withAdapter(ViemV2Adapter(provider, { publicClient }));

	return irysUploader;
};

export const FolderDropzone: React.FC<FolderDropzoneProps> = ({
	showImageView = true,
	showReceiptView = true,
	gasless = false,
}) => {
	const [files, setFiles] = useState<File[]>([]);
	console.log("files", files);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewURL, setPreviewURL] = useState<string>("");
	const [receipt, setReceipt] = useState<string>("");
	const [receiptQueryProcessing, setReceiptQueryProcessing] = useState<boolean>(false);
	const [txProcessing, setTxProcessing] = useState(false);
	const [message, setMessage] = useState<string>("");
	const [success, setSuccess] = useState<any>(null);

	const GATEWAY_BASE = "https://gateway.irys.xyz/";
	const [network, setNetwork] = useState<Chain | null>(null);

	useEffect(() => {
		setMessage("");
	}, []);

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const files = Array.from(event.target.files);
			// const newUploadedFiles: FileWrapper[] = files.map((file) => ({
			// 	file,
			// 	isUploaded: false,
			// 	id: "",
			// 	previewURL: "",
			// 	loadingReceipt: false,
			// }));
			setFiles(files);
		}
	};

	const resetFilesAndOpenFileDialog = useCallback(() => {
		setFiles([]);
		setReceipt("");
		setPreviewURL("");
		setSuccess(null);
		const input = document.querySelector('input[type="file"]') as HTMLInputElement;
		if (input) {
			input.click();
		}
	}, []);

	const handleUpload = async () => {
		setMessage("");

		if (!files || files.length === 0) {
			setMessage("Please select a folder first");
			return;
		}
		setTxProcessing(true);

		if (!network) {
			setMessage("Please select a network first");
			return;
		}

		const irysUploader = await getIrysUploader(network);

		// If more than one file is selected, then all files are wrapped together and uploaded in a single tx
		if (files.length >= 1) {
			try {
				// Remove the File objects from the FileWrapper objects
				const filesToUpload: File[] = files
				console.log("Multi-file upload");
				// let [manifestId, receiptId] = "";
				console.log("Standard upload")
				const response = await irysUploader.uploadFolder(filesToUpload);

				setSuccess(response);

				// console.log(`Upload success manifestId=${manifestId} receiptId=${receiptId}`);
				// Now that the upload is done, update the FileWrapper objects with the preview URL
				// const updatedFiles = files.map((file) => ({
				// 	...file,
				// 	id: receiptId,
				// 	isUploaded: true,
				// 	previewURL: manifestId + "/" + file.file.name,
				// }));
				// setFiles(updatedFiles);
			} catch (e) {
				console.log("Error on upload: ", e);
			}
		}
		setTxProcessing(false);
	};


	// Display only the last selected file's preview.
	const memoizedPreviewURL = useMemo(() => {
		if (previewURL) {
			return <UploadViewer previewURL={previewURL} checkEncrypted={false} />;
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
		<div className={`bg-white rounded-lg border shadow-2xl mx-auto min-w-full`}>
			<div className="flex p-5">
				<div className={`space-y-6 ${memoizedPreviewURL && memoizedReceiptView ? "w-1/2" : "w-full"}`}>
					<div
					// className="border-2 border-dashed bg-[#EEF0F6]/60 border-[#EEF0F6] rounded-lg p-4 text-center"
					>
						{files.length === 0 && <p className="text-gray-400 mb-2 text-center">Select a folder below to upload</p>}
						<input
							type="file"
							// @ts-ignore
							webkitdirectory="true"
							mozdirectory="true"
							directory="true"
							onChange={handleFileUpload}
							className="hidden"
						/>
						{!success && <button
							onClick={resetFilesAndOpenFileDialog}
							className={`disabled:opacity-50 disabled:cursor-not-allowed hover:scale-95 w-full min-w-full py-2 px-4 bg-[#DBDEE9] text-text font-bold rounded-md flex items-center justify-center transition-all  ${txProcessing ? "bg-[#DBDEE9] cursor-not-allowed" : "hover:bg-[#DBDEE9] hover:font-bold"
								}`}
							disabled={txProcessing}
						>
							{files.length > 0 ? "Select a different folder" : "Select Folder"}
						</button>}
						{files.length > 0 && <p className="text-gray-400  text-start mt-3">You {
							success ? "uploaded" : "are uploading"
						} {files.length} files:</p>}
					</div>
					{files.length > 0 && (
						<div className="-mt-2 flex flex-col border-l-2 border-gray-200 pl-4 overflow-y-scroll !max-h-[300px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 ">
							{/* Process and sort files by folder structure */}
							{(() => {
								// Build folder structure
								const structure: { [key: string]: File[] } = {};
								const folders = new Set<string>();

								// Group files by folder
								files.forEach(file => {
									const pathParts = file.webkitRelativePath.split('/');
									const fileName = pathParts.pop();
									const folderPath = pathParts.join('/');

									if (!structure[folderPath]) {
										structure[folderPath] = [];
									}
									structure[folderPath].push(file);

									// Add all parent folders
									let currentPath = '';
									pathParts.forEach(part => {
										currentPath = currentPath ? `${currentPath}/${part}` : part;
										folders.add(currentPath);
									});
								});

								// Sort folders by depth and alphabetically
								const sortedFolders = Array.from(folders).sort((a, b) => {
									const depthA = a.split('/').length;
									const depthB = b.split('/').length;
									if (depthA !== depthB) return depthA - depthB;
									return a.localeCompare(b);
								});

								// Render folders and their files
								return sortedFolders.map((folderPath, folderIndex) => (
									<div key={`folder-group-${folderIndex}`}>
										{/* Render folder */}
										<div className="flex items-center justify-start mb-2">
											<div className="flex items-center mr-2 text-text">
												<div style={{ marginLeft: `${folderPath.split('/').length * 20}px` }} className="flex items-center">
													<span className="mr-2">📁</span>
													{folderPath.split('/').pop()}
												</div>
											</div>
										</div>

										{/* Render files in this folder */}
										{structure[folderPath]?.map((file, fileIndex) => {
											const fileName = file.name;
											return (
												<div key={`file-${folderIndex}-${fileIndex}`} className="flex items-center justify-start mb-2">
													<div className="flex items-center mr-2 text-text">
														<div style={{ marginLeft: `${(folderPath.split('/').length + 1) * 20}px` }} className="flex items-center">
															<span className="mr-2">📄</span>
															{fileName}
														</div>
													</div>
												</div>
											);
										})}
									</div>
								));
							})()}
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

					{files.length > 0 && !success && (
						<div className="flex flex-col space-y-2">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button className="w-full disabled:opacity-50 disabled:cursor-not-allowed" variant="outline" disabled={txProcessing}>{network?.name || "Select Network"}</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									{NETWORKS.map((network) => (
										<DropdownMenuItem key={network.id} onClick={() => setNetwork(network)}>
											{network.name}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
							<MultiButton
								disabled={!network || txProcessing}
								onClick={handleUpload} requireLitAuth={false} checkConnect={!gasless}>
								{txProcessing ? <Spinner color="text-background" /> : "Upload"}
							</MultiButton>
						</div>
					)}

					{success && <div className="flex flex-col space-y-2">
						<Button className="font-bold mb-2 text-center" onClick={() => window.open(`https://gateway.irys.xyz/${success.manifestId}`, "_blank")}>View transaction on Gateway</Button>
						<Button className="font-bold mb-2 text-center" variant="outline" onClick={() => resetFilesAndOpenFileDialog()}>Upload another folder</Button>
					</div>}
				</div>
			</div>
		</div>
	);
};

export default FolderDropzone;

/* 
USAGE:
- Default: 
  <Uploader />

- To hide the image view button:
  <Uploader showImageView={false} />

- To hide the receipt view button:
<Uploader showReceiptView={false} />

Note:
* Default behavior is to show both image view and receipt view
*/

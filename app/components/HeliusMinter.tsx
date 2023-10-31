"use client";

import { AiOutlineFileSearch } from "react-icons/ai";
import { PiReceiptLight } from "react-icons/pi";
import { PublicKey } from "@solana/web3.js";

import Button from "./Button";
import ReceiptJSONView from "./ReceiptJSONView";
import Spinner from "./Spinner";
import UploadViewer from "./UploadViewer";
import Switch from "react-switch";
import fileReaderStream from "filereader-stream";
import { fundAndUpload } from "../utils/fundAndUpload";
import { encryptAndUploadFile } from "../utils/lit";

import getIrys from "../utils/getIrys";
import { useCallback } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { useRef } from "react";
import { useState } from "react";

import { Helius } from "helius-sdk";

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

export const HeliusMinter: React.FC = () => {
	const [files, setFiles] = useState<FileWrapper[]>([]);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewURL, setPreviewURL] = useState<string>("");
	const [receiptQueryProcessing, setReceiptQueryProcessing] = useState<boolean>(false);
	const [txProcessing, setTxProcessing] = useState(false);
	const [message, setMessage] = useState<string>("");
	const [nftName, setNftName] = useState("");
	const [nftSymbol, setNftSymbol] = useState("");
	const [nftDescription, setNftDescription] = useState("");
	const [walletAddress, setWalletAddress] = useState("");

	const GATEWAY_BASE = (process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/").endsWith("/")
		? process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/"
		: (process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/") + "/";

	useEffect(() => {
		setMessage("");
	}, []);

	// Add state to manage error messages
	const [errors, setErrors] = useState({
		nftName: "",
		nftSymbol: "",
		nftDescription: "",
		walletAddress: "",
	});

	const validateForm = () => {
		let isValid = true;
		let newErrors = {
			nftName: "",
			nftSymbol: "",
			nftDescription: "",
			walletAddress: "",
		};

		// NFT Name validation
		if (!nftName) {
			newErrors.nftName = "NFT name is required.";
			isValid = false;
		}

		// NFT Symbol validation
		if (!nftSymbol) {
			newErrors.nftSymbol = "NFT symbol is required";
			isValid = false;
		}

		// NFT Description validation
		if (!nftDescription) {
			newErrors.nftDescription = "NFT description is required";
			isValid = false;
		}

		// Solana wallet address validation
		if (!walletAddress) {
			newErrors.walletAddress = "Wallet address is required";
			isValid = false;
		} else {
			try {
				new PublicKey(walletAddress);
			} catch (e) {
				newErrors.walletAddress = "Invalid Solana wallet address";
				isValid = false;
			}
		}

		setErrors(newErrors);
		return isValid;
	};

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
		setPreviewURL("");
		const input = document.querySelector('input[type="file"]') as HTMLInputElement;
		if (input) {
			input.click();
		}
	}, []);

	const doMint = async () => {
		setMessage("");
		if (!validateForm()) {
			return;
		}
		if (!files || files.length === 0) {
			setMessage("Please select a file first");
			return;
		}
		setTxProcessing(true);

		console.log("Single file upload");
		try {
			const tags: Tag[] = [{ name: "Content-Type", value: files[0].file.type }];
			const uploadedTx = await fundAndUpload(files[0].file, tags);
			files[0].id = uploadedTx;
			files[0].isUploaded = true;
			files[0].previewURL = uploadedTx;
		} catch (e) {
			console.log("Error on upload: ", e);
		}

		console.log(`File uploaded to33 ${GATEWAY_BASE}${files[0].id}`);
		console.log("Minting asset");
		const imageURL = `${GATEWAY_BASE}${files[0].id}`;
		const heliusAPI = process.env.NEXT_PUBLIC_HELIUS_API || "";

		// Change below if you're working on mainnet
		//const url = `https://mainnet.helius-rpc.com/?api-key=${heliusAPI}`;
		try {
			const helius = new Helius(heliusAPI, "devnet");
			const response = await helius.mintCompressedNft({
				name: nftName,
				symbol: nftSymbol,
				owner: walletAddress,
				description: nftDescription,
				attributes: [],
				imageUrl: imageURL,
				externalUrl: "",
				sellerFeeBasisPoints: 6900,
			});
			console.log("Minted asset: ", response);
		} catch (e) {
			console.log("Error minting asset ", e);
		}
		setTxProcessing(false);
	};

	return (
		<div className={`bg-white rounded-lg border shadow-2xl mx-auto min-w-full`}>
			<h2 className="text-center text-xl font-bold p-4 bg-[#EEF0F6]/60">Helius NFT Minter</h2>

			<div className="flex flex-col p-5 space-y-4">
				{/* NFT Name */}
				<div className="bg-[#EEF0F6]/60 p-2 rounded-lg">
					<label htmlFor="nftName" className="block text-sm font-bold text-gray-700">
						Name: {errors.nftName && <span className="text-red-500 text-xs">{errors.nftName}</span>}
					</label>

					<input
						type="text"
						id="nftName"
						name="nftName"
						value={nftName}
						onChange={(e) => setNftName(e.target.value)}
						required
						className="mt-1 p-2 w-full border rounded-md"
					/>
				</div>

				{/* NFT Symbol */}
				<div className="bg-[#EEF0F6]/60 p-2 rounded-lg">
					<label htmlFor="nftSymbol" className="block text-sm font-bold text-gray-700">
						Symbol: {errors.nftSymbol && <span className="text-red-500 text-xs">{errors.nftSymbol}</span>}
					</label>

					<input
						type="text"
						id="nftSymbol"
						name="nftSymbol"
						maxLength={5}
						value={nftSymbol}
						onChange={(e) => setNftSymbol(e.target.value.toUpperCase())}
						required
						className="mt-1 p-2 w-full border rounded-md"
					/>
				</div>

				{/* NFT Symbol */}
				<div className="bg-[#EEF0F6]/60 p-2 rounded-lg">
					<label htmlFor="nftSymbol" className="block text-sm font-bold text-gray-700">
						Description:{" "}
						{errors.nftDescription && <span className="text-red-500 text-xs">{errors.nftDescription}</span>}
					</label>

					<input
						type="text"
						id="nftSymbol"
						name="nftSymbol"
						maxLength={5}
						value={nftDescription}
						onChange={(e) => setNftDescription(e.target.value.toUpperCase())}
						required
						className="mt-1 p-2 w-full border rounded-md"
					/>
				</div>
				{/* Destination Wallet Address */}
				<div className="bg-[#EEF0F6]/60 p-2 rounded-lg">
					<label htmlFor="walletAddress" className="block text-sm font-bold text-gray-700">
						Destination wallet:{" "}
						{errors.walletAddress && <span className="text-red-500 text-xs">{errors.walletAddress}</span>}
					</label>

					<input
						type="text"
						id="walletAddress"
						name="walletAddress"
						value={walletAddress}
						onChange={(e) => setWalletAddress(e.target.value)}
						required
						placeholder="Enter a valid Solana wallet address"
						className="mt-1 p-2 w-full border rounded-md"
					/>
				</div>
				<div className={`space-y-6 "w-full"}`}>
					<div
						className={`border-2 border-dashed bg-[#EEF0F6]/60 border-[#EEF0F6] rounded-lg p-4 text-center ${
							files[0] ? "hidden" : "" // Hide this if a file is selected
						}`}
						onDragOver={(event) => event.preventDefault()}
						onDrop={(event) => {
							event.preventDefault();
							const droppedFile = event.dataTransfer.files[0];
							if (droppedFile) {
								const validTypes = ["image/jpeg", "image/png", "image/gif"];
								if (validTypes.includes(droppedFile.type)) {
									setFiles([
										{
											// Using an array to maintain consistency with your state design
											file: droppedFile,
											isUploaded: false,
											id: "",
											previewURL: "",
											loadingReceipt: false,
										},
									]);
								} else {
									setMessage("Invalid file type. Please select a jpg, png, or gif file.");
								}
							}
						}}
					>
						<input
							type="file"
							onChange={handleFileUpload}
							accept=".jpg,.jpeg,.png,.gif" // File types
							className="hidden"
						/>
						<button
							onClick={resetFilesAndOpenFileDialog}
							className={`w-full min-w-full py-2 px-4 bg-[#DBDEE9] text-text font-bold rounded-md flex items-center justify-center transition-colors duration-500 ease-in-out  ${
								txProcessing ? "bg-[#DBDEE9] cursor-not-allowed" : "hover:bg-[#DBDEE9] hover:font-bold"
							}`}
							disabled={txProcessing}
						>
							{txProcessing ? <Spinner color="text-background" /> : "NFT image"}
						</button>
					</div>

					{/* Display the selected file name */}
					{files[0] && (
						<div className="text-center p-4 bg-[#EEF0F6]/60 rounded-lg">
							<span className="text-text font-bold">{files[0].file.name}</span>
						</div>
					)}
					<Button onClick={doMint} disabled={txProcessing} requireLitAuth={false}>
						{txProcessing ? <Spinner color="text-background" /> : "Mint"}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default HeliusMinter;

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

import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import Query from "@irys/query";
import { FaLock } from "react-icons/fa";
import { decryptFile } from "../utils/lit";

type UploadViewerProps = {
	previewURL: string; // The latter half of the URL, not including the GATEWAY address
	checkEncrypted: boolean; // Set to true if the component should check if the file is potentially encrypted
};

const UploadViewer: React.FC<UploadViewerProps> = ({ previewURL, checkEncrypted }) => {
	const [hasIrysEncrypted, setHasIrysEncrypted] = useState<boolean>(true);
	const [isDecrypted, setIsDecrypted] = useState(false);
	const [txProcessing, setTxProcessing] = useState(false);
	const [encryptedFileType, setEncryptedFileType] = useState("");
	const [message, setMessage] = useState("");
	const [decryptedURL, setDecryptedURL] = useState("");
	const GATEWAY_BASE = (process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/").endsWith("/")
		? process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/"
		: (process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/") + "/";

	useEffect(() => {
		async function fetchMetadataTags() {
			//@ts-ignore
			const myQuery = new Query({ network: process.env.NEXT_PUBLIC_NETWORK });
			const results = await myQuery.search("irys:transactions").ids([previewURL]);
			// If <1 tx not found, if >1 we have a problem
			if (results.length === 1) {
				const tags = results[0].tags;
				const encryptedTag = tags.find((tag) => tag.name === "Irys-Encrypted" && tag.value === "true");
				const encryptedFileTypeTag = tags.find((tag) => tag.name === "Encrypted-File-Content-Type");
				console.log("encryptedFileTypeTag=", encryptedFileTypeTag);
				setEncryptedFileType(encryptedFileTypeTag?.value || "image/png");
				if (encryptedTag) setHasIrysEncrypted(true);
			}
		}

		if (checkEncrypted) fetchMetadataTags();
		else setHasIrysEncrypted(false);
	}, [previewURL]);

	const doDecrypt = async () => {
		setTxProcessing(true);
		const result = await decryptFile(previewURL, encryptedFileType);
		setIsDecrypted(true);
		setDecryptedURL(result);
		//setMessage("Your wallet is not eligible to decrypt");
		setTxProcessing(false);
	};

	return (
		<div className="w-full h-full rounded-xl resize-none bg-primary object-cover flex items-center justify-center">
			{txProcessing ? (
				<Spinner color="text-background" />
			) : !checkEncrypted || (checkEncrypted && !hasIrysEncrypted) ? (
				<img src={GATEWAY_BASE + previewURL} alt="Thumbnail" />
			) : checkEncrypted && hasIrysEncrypted && !isDecrypted ? (
				message ? (
					<span>{message}</span>
				) : (
					<div className="flex flex-col items-center justify-center h-full w-full">
						<FaLock size={80} className="mb-4" />
						<button
							className="p-5 h-10 font-xs bg-black rounded-full text-white flex items-center justify-center transition-colors duration-500 ease-in-out hover:font-bold hover:text-white"
							onClick={doDecrypt}
						>
							DECRYPT
						</button>
					</div>
				)
			) : (
				<img src={decryptedURL} alt="Thumbnail" />
			)}
		</div>
	);
};

export default UploadViewer;

"use client";

import Button from "./MultiButton";
import Spinner from "./Spinner";
import { fundAndUpload } from "../utils/fundAndUpload";
import { useState } from "react";

// Define the Tag type
type Tag = {
	name: string;
	value: string;
};

export const UDLUploader: React.FC = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [fileType, setFileType] = useState<string>("");
	const [paymentType, setPaymentType] = useState<string>("Payment-Address");

	const [licenseFeeType, setLicenseFeeType] = useState<string>("None");
	const [licenseFeeUnit, setLicenseFeeUnit] = useState<number>();

	const [commercialUse, setCommercialUse] = useState<string>("None");
	const [currency, setCurrency] = useState<string>("U");
	const [paymentAddress, setPaymentAddress] = useState<string>("");
	const [derivation, setDerivation] = useState<string>("None");

	const [txProcessing, setTxProcessing] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("");

	const GATEWAY_BASE = (process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/").endsWith("/")
		? process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/"
		: (process.env.NEXT_PUBLIC_GATEWAY || "https://gateway.irys.xyz/") + "/";

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setSelectedFile(event.target.files[0]);
			setFileType(event.target.files[0].type);
		}
	};

	const handleUpload = async () => {
		setMessage("");
		if (!selectedFile) {
			setMessage("Please select a file first");
			return;
		}
		setTxProcessing(true);

		if (licenseFeeType !== "None" && (!licenseFeeUnit || licenseFeeUnit === 0)) {
			setMessage(`When selecting a License-Fee of "${licenseFeeType}" you must provide a unit.`);
			setTxProcessing(false);
			return;
		}

		const tags: Tag[] = [];
		tags.push({ name: "Content-Type", value: fileType });
		tags.push({
			name: "License",
			value: "yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8",
		});
		if (licenseFeeType !== "None")
			tags.push({
				name: "License-Fee",
				value: licenseFeeType + "-" + licenseFeeUnit,
			});
		if (commercialUse !== "None") tags.push({ name: "Commerical-Use", value: commercialUse });
		tags.push({ name: "Currency", value: currency });
		if (paymentAddress) tags.push({ name: paymentType, value: paymentAddress });
		if (derivation) tags.push({ name: "Derivation", value: derivation });

		const txId = await fundAndUpload(selectedFile, tags);
		console.log(`File uploaded ==> ${GATEWAY_BASE}${txId}`);
		setMessage(`File <a class="underline" target="_blank" href="${GATEWAY_BASE}${txId}">uploaded</a>`);
		setTxProcessing(false);
	};

	return (
		<div className="w-[400px] bg-white rounded-lg shadow-2xl p-5">
			<div className="pr-4 mt-5 space-y-4">
				<div className="rounded-lg ">
					<div
						className={`border-2 border-dashed bg-[#EEF0F6]/60 border-[#EEF0F6] rounded-lg p-4 text-center z-50`}
						onDragOver={(event) => event.preventDefault()}
						onDrop={(event) => {
							event.preventDefault();
							const droppedFiles = Array.from(event.dataTransfer.files);
							setSelectedFile(droppedFiles[0] || null);
							setFileType(droppedFiles[0]?.type || "");
						}}
					>
						<p className="text-gray-400 mb-2">Drag and drop a file here</p>

						{!selectedFile ? (
							<div className="relative inline-block">
								<button
									onClick={() => {
										const input = document.getElementById("fileInput");
										if (input) {
											input.click();
										}
									}}
									className={`w-full min-w-full py-2 px-4 bg-[#DBDEE9] text-text font-bold rounded-md flex items-center justify-center transition-colors duration-500 ease-in-out`}
								>
									Select A File
								</button>
								<input type="file" id="fileInput" onChange={handleFileUpload} className="hidden" />
							</div>
						) : (
							<span className="px-4 py-2 bg-primary text-text rounded-md border-1">{selectedFile.name}</span>
						)}
					</div>
				</div>
				<div className="border rounded-md">
					<p className="text-background-contrast rounded-md py-4 text-left pl-5">Configure UDL</p>
					<div className="flex flex-col bg-neutral-50 rounded-lg p-5">
						<label htmlFor="license-fee-type" className="text-text text-xs mb-1">
							License Fee
						</label>
						<div className="flex flex-row">
							<select
								id="license-fee-type"
								value={licenseFeeType}
								onChange={(e) => setLicenseFeeType(e.target.value)}
								className="bg-[#EEF0F6] px-2 py-1 text-text rounded-md text-xs"
							>
								<option value="None">None</option>
								<option value="One-Time">One-Time</option>
								<option value="Monthly">Monthly</option>
							</select>
							<input
								type="number"
								id="license-fee-unit"
								value={licenseFeeUnit}
								onChange={(e) => setLicenseFeeUnit(Number(e.target.value))}
								className="bg-[#EEF0F6] text-text rounded-md ml-3 text-xs pl-2"
							/>
						</div>
						<label htmlFor="commercial-use" className="mb-1 text-text mt-3  text-xs">
							Commercial Use
						</label>
						<select
							id="commercial-use"
							value={commercialUse}
							onChange={(e) => setCommercialUse(e.target.value)}
							className="bg-[#EEF0F6] px-2 py-1 text-text rounded-md text-xs"
						>
							<option value="None">None</option>
							<option value="Allowed">Allowed</option>
							<option value="Allowed-With-Credit">Allowed-With-Credit</option>
						</select>
						<label htmlFor="currency" className="mb-1 text-text mt-3  text-xs">
							Currency
						</label>
						<select
							id="currency"
							value={currency}
							onChange={(e) => setCurrency(e.target.value)}
							className="bg-[#EEF0F6] px-2 py-1 text-text rounded-md text-xs"
						>
							<option value="U">U</option>
							<option value="AR">Arweave</option>
							<option value="MATIC">Matic</option>
							<option value="ETH">Ethereum</option>
							<option value="SOl">Solana</option>
						</select>
						<label htmlFor="derivation" className="mb-1 text-text mt-3 text-xs">
							Derivation
						</label>
						<select
							id="derivation"
							value={derivation}
							onChange={(e) => setDerivation(e.target.value)}
							className="bg-[#EEF0F6] px-2 py-1 text-text rounded-md text-xs"
						>
							<option value="None">None</option>
							<option value="Allowed-With-Credit">Allowed-With-Credit</option>
							<option value="Allowed-With-Indication">Allowed-With-Indication</option>
							<option value="Allowed-With-License-Passthrough">Allowed-With-License-Passthrough</option>
							<option value="Allowed-With-RevenueShare-25%">Allowed-With-RevenueShare-25%</option>
							<option value="Allowed-With-RevenueShare-50%">Allowed-With-RevenueShare-50%</option>
							<option value="Allowed-With-RevenueShare-75%">Allowed-With-RevenueShare-75%</option>
							<option value="Allowed-With-RevenueShare-100%">Allowed-With-RevenueShare-100%</option>
						</select>
						<select
							id="address-type"
							className="bg-[#EEF0F6] px-2 mt-3 py-1 text-text rounded-md text-xs max-w-[200px]"
							onChange={(e) => {
								setPaymentType(e.target.value);
							}}
						>
							<option value="Payment-Address">Payment Address</option>
							<option value="Contract">Contract</option>
						</select>
						<input
							id="payment-address"
							value={paymentAddress}
							onChange={(e) => setPaymentAddress(e.target.value)}
							className="bg-[#EEF0F6] text-text rounded-md text-xs pl-2 px-2 py-1 mt-1"
						/>
					</div>
				</div>
				{message && <div className="text-red-500 mt-2" dangerouslySetInnerHTML={{ __html: message }} />}
				<Button onClick={handleUpload} disabled={txProcessing}>
					{txProcessing ? <Spinner color="text-background" /> : "Upload"}
				</Button>
			</div>
		</div>
	);
};

export default UDLUploader;

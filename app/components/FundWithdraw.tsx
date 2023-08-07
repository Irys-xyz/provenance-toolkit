"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import Switch from "react-switch";
import getBundlr from "../utils/getBundlr";
import Spinner from "./Spinner";

interface OptionType {
	value: string;
	label: string;
}

const nodes: OptionType[] = [
	{ value: "https://node1.bundlr.network", label: "node1.bundlr.network" },
	{ value: "https://node2.bundlr.network", label: "node2.bundlr.network" },
	{ value: "https://devnet.bundlr.network", label: "devnet.bundlr.network" },
];

const currencies: OptionType[] = [
	{ value: "aptos", label: "Aptos" },
	{ value: "algorand", label: "Algorand" },
	{ value: "arbitrum", label: "Arbitrum" },
	{ value: "arweave", label: "Arweave" },
	{ value: "avalanche", label: "Avalanche" },
	{ value: "boba", label: "Boba" },
	{ value: "boba-eth", label: "Boba-ETH" },
	{ value: "chainlink", label: "Chainlink" },
	{ value: "ethereum", label: "Ethereum" },
	{ value: "fantom", label: "Fantom" },
	{ value: "near", label: "Near" },
	{ value: "matic", label: "Matic" },
	{ value: "solana", label: "Solana" },
];

export const FundWithdraw: React.FC = () => {
	const [selectedNode, setSelectedNode] = useState<OptionType | null>(null);
	const [selectedCurrency, setSelectedCurrency] = useState<OptionType | null>(null);
	const [amount, setAmount] = useState<number>(0.0);
	const [isFunding, setIsFunding] = useState<boolean>(true);
	const [message, setMessage] = useState<string>("");
	const [txProcessing, setTxProcessing] = useState<boolean>(false);

	const handleNodeChange = (selectedOption: OptionType) => setSelectedNode(selectedOption);
	const handleCurrencyChange = (selectedOption: OptionType) => setSelectedCurrency(selectedOption);
	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value);
	const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => setIsFunding(e.target.value === "fund");

	useEffect(() => {
		setAmount(0);
		const getCurBalance = async () => {
			try {
				const bundlr = await getBundlr(selectedNode?.value, selectedCurrency?.value);
				const loadedBalance = await bundlr.getLoadedBalance();
				// Show currently funded balance iff we're in withdraw mode
				if (!isFunding) setAmount(bundlr.utils.fromAtomic(loadedBalance));
			} catch (error) {
				console.log("Error fetching Bundlr:", error);
			}
		};
		if (selectedNode && selectedCurrency) getCurBalance();
	}, [selectedNode, selectedCurrency, isFunding]);

	const handleFundWithdraw = async () => {
		setMessage("");
		// Validate input
		if (!selectedNode) {
			setMessage("Please select a node to fund");
			return;
		}
		if (!selectedCurrency) {
			setMessage("Please select to currency to use when funding");
			return;
		}
		if (amount === 0) {
			setMessage("Please enter an amount greater than 0");
			return;
		}

		// Validation passed, get a reference to an Bundlr node
		const bundlr = await getBundlr();
		setTxProcessing(true);

		// If fund mode do fund
		if (isFunding) {
			try {
				console.log("calling fund with ", bundlr.utils.toAtomic(amount).toString());
				const fundTx = await bundlr.fund(bundlr.utils.toAtomic(amount));
				setMessage("Funding successful");
			} catch (e) {
				setMessage("Error while funding: ", e);
				console.log(e);
			}
		} else {
			// If withdraw mode, do withdraw
			try {
				const fundTx = await bundlr.withdrawBalance(bundlr.utils.toAtomic(amount));
				setMessage("Withdraw successful");
			} catch (e) {
				setMessage("Error while withdrawing: ", e);
				console.log(e);
			}
		}
		setTxProcessing(false);
	};
	return (
		<div className="bg-background rounded-lg shadow-2xl p-5 w-[500px] h-700">
			<h2 className="text-3xl text-center font-bold mb-4 text-text">Fund / Withdraw</h2>
			<Select
				className="mb-4"
				options={nodes}
				onChange={handleNodeChange}
				value={selectedNode}
				placeholder="Select a node..."
				styles={{
					control: (base) => ({ ...base, backgroundColor: "#D3D9EF", borderRadius: "0.375rem" }),
					option: (base) => ({ ...base, backgroundColor: "#D3D9EF" }),
				}}
			/>
			<Select
				className="mb-4"
				options={currencies}
				onChange={handleCurrencyChange}
				value={selectedCurrency}
				placeholder="Select a currency..."
				styles={{
					control: (base) => ({ ...base, backgroundColor: "#D3D9EF", borderRadius: "0.375rem" }),
					option: (base) => ({ ...base, backgroundColor: "#D3D9EF" }),
				}}
			/>
			<input
				type="number"
				step="0.0000001"
				className="block w-full mb-4 bg-background text-text rounded-md p-3 border border-gray-300 shadow-sm"
				value={amount}
				onChange={handleAmountChange}
			/>
			<div className="mb-4 text-text">
				<label>
					<input
						type="radio"
						className="mr-1"
						name="fundWithdraw"
						value="fund"
						checked={isFunding}
						onChange={handleOptionChange}
					/>
					Fund
				</label>
				<label>
					<input
						type="radio"
						className="ml-5 mr-1"
						name="fundWithdraw"
						value="withdraw"
						checked={!isFunding}
						onChange={handleOptionChange}
					/>
					Withdraw
				</label>
			</div>
			{message && <div className="text-red-500">{message}</div>}
			<button
				className={`w-full py-2 px-4 bg-background text-text rounded-md flex items-center justify-center transition-colors duration-500 ease-in-out border-2 border-background-contrast ${
					txProcessing
						? "bg-background-contrast text-white cursor-not-allowed"
						: "hover:bg-background-contrast hover:text-white"
				}`}
				onClick={handleFundWithdraw}
				disabled={txProcessing}
			>
				{txProcessing ? <Spinner color="text-background" /> : isFunding ? "Fund Node" : "Withdraw From Node"}
			</button>
		</div>
	);
};

export default FundWithdraw;

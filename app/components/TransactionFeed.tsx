"use client";

import { useEffect, useState } from "react";

import Button from "./Button";
import QueryResultsItem from "./QueryResultsItem";
import Select, { SingleValue, ActionMeta } from "react-select";

import Spinner from "./Spinner";
import queryGraphQL from "../utils/queryGraphQL";

interface OptionType {
	value: string;
	label: string;
}

// Models the result of a single search
interface QueryResult {
	txID: string;
	creationDate: string;
	token: string;
	tags: any[];
}

const nodes: OptionType[] = [
	{ value: "https://node1.bundlr.network/graphql", label: "node1.bundlr.network" },
	{ value: "https://node2.bundlr.network/graphql", label: "node2.bundlr.network" },
	{ value: "https://devnet.bundlr.network/graphql", label: "devnet.bundlr.network" },
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

const contentTypes: OptionType[] = [
	{ value: "image/jpeg", label: "image/jpeg" },
	{ value: "image/png", label: "image/png" },
	{ value: "image/gif", label: "image/gif" },
];

export const TransactionFeed: React.FC = () => {
	const [selectedNode, setSelectedNode] = useState<OptionType | null>(null);
	const [selectedCurrency, setSelectedCurrency] = useState<OptionType | null>(null);
	const [selectedContentType, setSelectedContentType] = useState<OptionType | null>(null);
	const [fromTimestamp, setFromTimestamp] = useState<string>("");
	const [toTimestamp, setToTimestamp] = useState<string>("");
	const [imageArray, setImageArray] = useState<string[]>([]);
	const [txProcessing, setTxProcessing] = useState(false);
	const [queryResults, setQueryResults] = useState<QueryResult[]>([]);

	const handleNodeChange = (selectedOption: SingleValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {
		setSelectedNode(selectedOption as OptionType);
	};
	const handleCurrencyChange = (selectedOption: SingleValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {
		setSelectedCurrency(selectedOption as OptionType);
	};

	const handleContentTypeChange = (selectedOption: SingleValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {
		setSelectedContentType(selectedOption as OptionType);
	};

	const [error, setError] = useState("");

	useEffect(() => {
		setSelectedNode(nodes[0]);
	}, []);

	const handleFromTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFromTimestamp(e.target.value);
	};

	const handleToTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setToTimestamp(e.target.value);
	};

	const handleQuery = async () => {
		setTxProcessing(true);
		setQueryResults([]);

		setError("");
		if (selectedNode === null) {
			// Should never happen, but better to check
			setError("Please select a node");
			return;
		}

		// Convert the timestamp strings to Date objects
		const fromDate = fromTimestamp ? new Date(fromTimestamp) : null;
		const toDate = toTimestamp ? new Date(toTimestamp) : null;

		try {
			const results = await queryGraphQL(
				selectedNode.value,
				selectedContentType?.value ?? null,
				selectedCurrency?.value ?? null,
				fromDate, // Use the converted Date object
				toDate, // Use the converted Date object
			);

			setQueryResults(results);
		} catch (error) {
			setError("Error executing the GraphQL query");
		} finally {
			setTxProcessing(false);
		}
	};

	return (
		<div className="bg-white border rounded-lg shadow-2xl p-5 w-700 h-700">
			<div className="flex flex-row">
				<div className="space-y-4 self-end">
					{error && <div className="text-red-500">{error}</div>}

					<Select
						className="mb-4"
						options={nodes}
						onChange={handleNodeChange}
						value={selectedNode}
						placeholder="Select a node..."
						// styles={{
						// 	control: (base) => ({ ...base, backgroundColor: "#D3D9EF", borderRadius: "0.375rem" }),
						// 	option: (base) => ({ ...base, backgroundColor: "#D3D9EF" }),
						// }}
					/>
					<Select
						className="mb-4"
						options={currencies}
						onChange={handleCurrencyChange}
						value={selectedCurrency}
						placeholder="Select a currency..."
						// styles={{
						// 	control: (base) => ({ ...base, backgroundColor: "#D3D9EF", borderRadius: "0.375rem" }),
						// 	option: (base) => ({ ...base, backgroundColor: "#D3D9EF" }),
						// }}
					/>
					<Select
						className="mb-4"
						options={contentTypes}
						onChange={handleContentTypeChange}
						value={selectedContentType}
						placeholder="Select a content type..."
						// styles={{
						// 	control: (base) => ({ ...base, backgroundColor: "#D3D9EF", borderRadius: "0.375rem" }),
						// 	option: (base) => ({ ...base, backgroundColor: "#D3D9EF" }),
						// }}
					/>
					<input
						type="datetime-local"
						value={fromTimestamp}
						onChange={handleFromTimestampChange}
						className="w-full p-2 rounded border border-gray-300"
						placeholder="From Timestamp"
					/>
					<input
						type="datetime-local"
						value={toTimestamp}
						onChange={handleToTimestampChange}
						className="w-full p-2 rounded border border-gray-300"
						placeholder="To Timestamp"
					/>
					<div className="flex">
						<Button onClick={handleQuery} disabled={txProcessing}>
							{txProcessing ? <Spinner color="text-background" /> : "Query"}
						</Button>
					</div>
				</div>
				{queryResults && queryResults.length > 0 && (
					<div className="ml-5 bg-primary h-[320px] w-[340px] overflow-y-auto rounded-lg align-start">
						{
							// For each result, render a SearchResultsItem component
							queryResults &&
								queryResults.map((result) => (
									<QueryResultsItem
										key={result.txID} // Unique key
										txID={result.txID} // Transaction ID
										token={result.token} // Token used for payment
										creationDate={result.creationDate} // Creation date
										tags={result.tags} // Any associated tags
									/>
								))
						}
					</div>
				)}
			</div>
		</div>
	);
};

export default TransactionFeed;

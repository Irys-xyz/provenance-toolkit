import { WebBundlr } from "@bundlr-network/client";
import { ethers } from "ethers";
interface Tag {
	name: string;
	value: string;
}

interface Node {
	id: string;
	timestamp: string;
	currency: string;
	tags: Tag[];
}

interface Edge {
	node: Node;
}

interface DataResponse {
	transactions: {
		edges: Edge[];
	};
}

interface QueryResult {
	txID: string;
	creationDate: string;
	token: string;
	tags: Tag[];
}

/**
 * Process the data response from the GraphQL query and convert it into an array of QueryResult objects.
 * @param data The data response from the GraphQL query.
 * @returns An array of QueryResult objects.
 */
const processDataResponse = (data: DataResponse): QueryResult[] => {
	const queryResults: QueryResult[] = [];

	if (data && data.transactions && data.transactions.edges) {
		const edges: Edge[] = data.transactions.edges;

		for (const edge of edges) {
			const node: Node = edge.node;
			const queryResult: QueryResult = {
				txID: node.id,
				creationDate: node.timestamp,
				token: node.currency,
				tags: [],
			};

			if (node.tags && node.tags.length > 0) {
				for (const tag of node.tags) {
					queryResult.tags.push(tag);
				}
			}

			queryResults.push(queryResult);
		}
	}

	return queryResults;
};

/**
 * Execute a GraphQL query from the browser using the provided parameters.
 * @param endpoint The URL of the GraphQL endpoint to connect to.
 * @param contentType The content type string to be used in the query. Can be null.
 * @param currency The currency string to be used in the query. Can be null.
 * @param from The starting date for the timestamp filter. Can be null.
 * @param to The ending date for the timestamp filter. Can be null.
 * @returns An array of QueryResult objects.
 */
const queryGraphQL = async (
	endpoint: string,
	contentType: string | null,
	currency: string | null,
	from: Date | null,
	to: Date | null,
): Promise<QueryResult[]> => {
	// Start building the GraphQL query string
	let query = "query getData { transactions";

	// Check for any arguments to include in the query
	if (contentType ?? (null || currency) ?? (null || (from ?? null) !== null || (to ?? null) !== null)) {
		query += "(";

		// Add the tags field to the query if contentType is not null (or undefined)
		if (contentType ?? null) {
			query += 'tags: [{ name: "Content-Type", values: ["' + contentType + '"]}], ';
		}

		// Check for currency (null or undefined)
		if (currency ?? null) {
			query += 'currency: "' + currency + '", ';
		}

		// Check for from and to (null or undefined)
		if (from instanceof Date && to instanceof Date) {
			const fromTimestamp = from.getTime();
			const toTimestamp = to.getTime();
			query += "timestamp: { from: " + fromTimestamp + ", to: " + toTimestamp + " }, ";
		}

		// Complete the arguments section of the query
		query = query.slice(0, -2); // Remove the trailing comma and space
		query += ")";
	}

	// Complete the query string
	query += " { edges { node { id currency timestamp tags { name value } } } } }";
	console.log("executing ", query);
	console.log("endpoint=", endpoint);
	try {
		const response = await fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ query }),
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data: DataResponse = await response.json();
		console.log("data=", data);

		const processedData = processDataResponse(data.data);
		console.log(processedData);
		return processedData;
	} catch (error) {
		console.error("Error executing the GraphQL query:", error);
		return [];
	}
};

// Example usage:
// queryGraphQL("https://devnet.bundlr.network/graphql", "image/jpeg", "matic", new Date("2023-08-01"), new Date("2023-08-31"));

export default queryGraphQL;

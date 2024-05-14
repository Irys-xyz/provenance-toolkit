import React from "react";
import toTitleCase from "../utils/titleCase";
import Link from "next/link";

// Describes the structure of a metadata tag
export interface Tag {
	name: string;
	value: string;
}

// Defines the properties of the SearchResultsItem component
interface QueryResultsItemProps {
	txID: string; // Transaction ID
	creationDate: string; // Date of transaction creation
	token: string; // Token used for payment
	tags: Tag[]; // Array of Tags
}

// Functional component that displays information for an individual search result
const QueryResultsItem: React.FC<QueryResultsItemProps> = ({ txID, creationDate, token, tags }) => {
	const isImage = (tags: { name: string; value: string }[]): boolean => {
		const imageMimeTypes = [
			"image/jpeg",
			"image/png",
			"image/gif",
			"image/bmp",
			"image/webp",
			"image/tiff",
			"image/svg+xml",
			"image/vnd.microsoft.icon",
		];

		const contentTypeTag = tags.find((tag) => tag.name.toLowerCase() === "content-type");

		if (contentTypeTag) {
			const contentType = contentTypeTag.value.toLowerCase();
			return imageMimeTypes.includes(contentType);
		}

		return false;
	};

	return (
		<div className="flex flex-col bg-white shadow-2xl m-2 p-4 rounded-lg">
			{/* Display thumbnail image, if the content type is one of the image ones */}
			{isImage(tags) && <img className="rounded-xl" src={"https://gateway.irys.xyz/" + txID} alt="Thumbnail" />}
			{/* Display truncated Transaction ID */}
			<p className="text-text text-xs mt-5">
				<span className="font-bold">Tx ID: </span>{" "}
				<Link className="underline" href={`https://gateway.irys.xyz/${txID}`} target="_blank">
					{txID.slice(0, 5).concat(".....", txID.slice(-5))}
				</Link>
			</p>

			{/* Display creation date */}
			<p className="text-text text-xs ">
				<span className="font-bold">Creation Date:</span> {creationDate}
			</p>

			{/* Display token info */}
			<p className="text-text text-xs ">
				<span className="font-bold">Token:</span> {toTitleCase(token)}
			</p>

			{/* List all associated tags */}
			<ul className="mt-3 text-xs">
				{tags.map((tag: Tag, i: number) => (
					<li key={i}>
						{tag.name}: {tag.value.length > 20 ? tag.value.substring(0, 20) + "..." : tag.value}
					</li>
				))}
			</ul>
		</div>
	);
};

export default QueryResultsItem;

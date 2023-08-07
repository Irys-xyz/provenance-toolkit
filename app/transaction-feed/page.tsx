import React, { FC } from "react";
import TransactionFeed from "../components/TransactionFeed";

const Page: FC = () => {
	return (
		<div className="min-h-screen bg-gray-200 text-text flex justify-center items-center">
			<TransactionFeed />
		</div>
	);
};

export default Page;

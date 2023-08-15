import React, { FC } from "react";

import TransactionFeed from "../components/TransactionFeed";

const Page: FC = () => {
	return (
		<div className="min-h-screen bg-background text-text flex justify-center items-center">
			<TransactionFeed />
		</div>
	);
};

export default Page;

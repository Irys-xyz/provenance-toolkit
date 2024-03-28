import React, { FC } from "react";

import TransactionFeed from "../../components/TransactionFeed";

const Page: FC = () => {
	return (
		<div className="py-10 bg-background text-text flex justify-center items-start">
			<TransactionFeed />
		</div>
	);
};

export default Page;

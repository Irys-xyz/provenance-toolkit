import React, { FC } from "react";
import FundWithdraw from "../components/FundWithdraw";

const Page: FC = () => {
	return (
		<div className="min-h-screen bg-gray-200 text-text flex justify-center items-center">
			<FundWithdraw />
		</div>
	);
};

export default Page;

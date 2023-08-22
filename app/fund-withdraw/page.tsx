"use client";
import React, { FC } from "react";
import FundWithdraw from "../components/FundWithdraw";

const Page: FC = () => {
	return (
		<div className="min-h-screen bg-background text-text flex flex-col justify-center items-center space-y-8 px-4 mt-24">
			<div className="w-3/5">
				<FundWithdraw />{" "}
			</div>

			<div className="w-3/5 flex flex-col text-xs space-y-4">
				<p className="text-sm">Usage example:</p>

				<p>- To fix the node:</p>
				<code className="bg-gray-100 rounded">
					{'<FundWithdraw config={{ node: "https://node1.bundlr.network" }} />'}
				</code>

				<p>- To fix the currency:</p>
				<code className="bg-gray-100 rounded">{'<FundWithdraw config={{ currency: "ethereum" }} />'}</code>

				<p>- To set component to fund-only:</p>
				<code className="bg-gray-100 rounded">{"<FundWithdraw config={{ fundOnly: true }} />"}</code>

				<p>- To set the component to withdraw-only:</p>
				<code className="bg-gray-100 rounded">{"<FundWithdraw config={{ withdrawOnly: true }} />"}</code>
			</div>
		</div>
	);
};

export default Page;

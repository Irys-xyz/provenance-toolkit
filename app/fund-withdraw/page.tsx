"use client";
import React, { FC } from "react";
import FundWithdraw from "../components/FundWithdraw";

const Page: FC = () => {
	return (
		<div className="min-h-screen bg-background text-text flex flex-col md:flex-row justify-center items-center mt-24 space-x-1">
			<div className="w-2/5">
				<FundWithdraw />{" "}
			</div>

			<div className="w-2/5 flex flex-col text-xs space-y-1 items-start">
				<p className="text-xl bg-gray-100 rounded-xl px-2">Usage example:</p>

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

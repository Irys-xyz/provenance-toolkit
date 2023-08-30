"use client";

import React, { FC } from "react";

import FundWithdraw from "../components/FundWithdraw";

const Page: FC = () => {
	return (
		<div className="mx-auto py-10 bg-background text-text flex flex-col-reverse gap-10 md:flex-row justify-center items-center">
			<div className="p-10 w-full md:w-1/3 md:p-0">
				{/* <FundWithdraw /> */}
				{/* <FundWithdraw node="https://node1.bundlr.network" /> */}
				<FundWithdraw node="https://node1.bundlr.network" currency="matic" />
			</div>

			<div className="flex flex-col text-xs space-y-1 items-start">
				<h1 className="text-2xl font-bold rounded-xl mb-3">Usage example:</h1>

				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<p className="text-base text-neutral-700">To fix the node:</p>
						<code className="rounded bg-[#D8CFCA] px-2 py-1">
							{'<FundWithdraw node="https://node1.bundlr.network" />'}
						</code>
					</div>
					<div className="flex flex-col gap-2">
						<p className="text-base text-neutral-700">To fix the currency:</p>
						<code className="rounded bg-[#D8CFCA] px-2 py-1">{'<FundWithdraw currency="ethereum" />'}</code>
					</div>
					<div className="flex flex-col gap-2">
						<p className="text-base text-neutral-700">To set component to fund-only:</p>
						<code className="rounded bg-[#D8CFCA] px-2 py-1">{"<FundWithdraw fundOnly={ true } />"}</code>
					</div>
					<div className="flex flex-col gap-2">
						<p className="text-base text-neutral-700">To set the component to withdraw-only:</p>
						<code className="rounded bg-[#D8CFCA] px-2 py-1">
							<code className="rounded bg-[#D8CFCA] px-2 py-1">
								{"<FundWithdraw withdrawOnly={ true } />"}
							</code>
						</code>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;

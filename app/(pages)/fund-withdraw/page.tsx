import React, { FC } from "react";
import FundWithdraw from "../../components/FundWithdraw";

const Page: FC = () => {
	return (
		<div className="mx-auto py-10 bg-background text-text flex flex-col-reverse gap-10 md:flex-row justify-center items-start">
			<div className="p-10 w-full md:w-1/3 md:p-0">
				<FundWithdraw />
			</div>

			<div className="flex flex-col space-y-4 p-5 rounded-lg border">
				<h1 className="text-start text-xl font-bold p-1 rounded-lg bg-[#EEF0F6]/60">Overview</h1>
				<div className="bg-[#EEF0F6]/60 rounded-lg">
					<h2 className="font-bold">This component:</h2>
					<ul className="list-decimal pl-5">
						<li>Funds nodes</li>
						<li>Withdraws funds from nodes</li>
					</ul>
				</div>
				<h1 className="text-start text-xl font-bold p-1 rounded-lg bg-[#EEF0F6]/60 mt-5">Usage</h1>
				<div className="bg-[#EEF0F6]/60 rounded-lg">
					<div className="flex flex-col gap-4 text-xs">
						<div className="flex flex-col gap-2">
							<p className="text-base text-neutral-700">Default:</p>
							<code className="rounded bg-[#D8CFCA] px-2 py-1">{"<FundWithdraw  />"}</code>
						</div>
						<div className="flex flex-col gap-2">
							<p className="text-base text-neutral-700">To fix the network:</p>
							<code className="rounded bg-[#D8CFCA] px-2 py-1">{'<FundWithdraw network="mainnet" />'}</code>
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
								<code className="rounded bg-[#D8CFCA] px-2 py-1">{"<FundWithdraw withdrawOnly={ true } />"}</code>
							</code>
						</div>
					</div>
				</div>
				<h1 className="text-start text-xl font-bold p-1 rounded-lg bg-[#EEF0F6]/60">Docs</h1>
				<div className="bg-[#EEF0F6]/60 rounded-lg">
					<ul className="list-decimal pl-5">
						<li>
							<a
								className="text-blue-500 hover:text-blue-700 underline"
								href="https://docs.irys.xyz/developer-docs/provenance-toolkit/fund-withdraw"
								target="_blank"
							>
								Provenance Toolkit docs
							</a>
						</li>{" "}
						<li>
							<a
								className="text-blue-500 hover:text-blue-700 underline"
								href="https://github.com/Irys-xyz/provenance-toolkit"
								target="_blank"
							>
								Provenance Toolkit GitHub
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Page;

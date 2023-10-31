import React, { FC } from "react";
import { HeliusMinter } from "../components/HeliusMinter";

const Page: FC = () => {
	return (
		<div className="mx-auto py-10 bg-background text-text flex flex-col-reverse gap-10 md:flex-row justify-center items-start">
			<div className="p-10 w-full md:w-1/3 md:p-0">
				<HeliusMinter />
			</div>

			<div className="flex flex-col space-y-4 p-5 rounded-lg border">
				<h1 className="text-start text-xl font-bold p-1 rounded-lg bg-[#EEF0F6]/60">Overview</h1>
				<div className="bg-[#EEF0F6]/60 rounded-lg">
					<h2 className="font-bold">This component:</h2>
					<ul className="list-decimal pl-5">
						<li>Uploads your image to Irys</li>
						<li>
							Mints your image as a Solana NFT using the{" "}
							<a
								className="text-blue-500 hover:text-blue-700 underline"
								href="https://docs.helius.dev/resources/sdks"
								target="_blank"
							>
								Helius SDK
							</a>
						</li>
					</ul>
					<p>Once complete, the NFT will be visible in your wallet.</p>
					<p className="text-red-500 text-sm">* The NFT is minted on Solana Devnet</p>
				</div>
				<h1 className="text-start text-xl font-bold p-1 rounded-lg bg-[#EEF0F6]/60 mt-5">Usage</h1>
				<div className="bg-[#EEF0F6]/60 rounded-lg">
					<code className="rounded bg-[#D8CFCA] px-2 py-1 text-xs ">{"<HeliusMinter />"}</code>
					<p className="mt-2">
						Before testing, set the <span className="bg-gray-200 p-1 text-xs">NEXT_PUBLIC_HELIUS_API</span>{" "}
						variable in <span className="bg-gray-200 p-1 text-xs">.env.local</span>
					</p>
				</div>
				<h1 className="text-start text-xl font-bold p-1 rounded-lg bg-[#EEF0F6]/60">Docs</h1>
				<div className="bg-[#EEF0F6]/60 rounded-lg">
					<ul className="list-decimal pl-5">
						<li>
							<a
								className="text-blue-500 hover:text-blue-700 underline"
								href="https://docs.irys.xyz/developer-docs/provenance-toolkit"
								target="_blank"
							>
								Provenance Toolkit Docs
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
						<li>
							<a
								className="text-blue-500 hover:text-blue-700 underline"
								href="https://docs.helius.dev/resources/sdks"
								target="_blank"
							>
								Helius Docs
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Page;

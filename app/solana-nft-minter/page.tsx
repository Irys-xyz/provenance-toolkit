import React, { FC } from "react";
import { SolanaNFTMinter } from "../components/SolanaNFTMinter";

const Page: FC = () => {
	return (
		<div className="mx-auto py-10 bg-background text-text flex flex-col-reverse gap-10 md:flex-row justify-center items-start">
			<div className="p-10 w-full md:w-1/3 md:p-0">
				<SolanaNFTMinter gasless={true} />
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
					<p className="mt-2">
						Before testing, set the <span className="bg-gray-200 p-1 text-xs">NEXT_PUBLIC_HELIUS_API</span>{" "}
						variable in <span className="bg-gray-200 p-1 text-xs">.env.local</span>
					</p>
				</div>
				<h1 className="text-start text-xl font-bold p-1 rounded-lg bg-[#EEF0F6]/60 mt-5">Usage</h1>
				<div className="bg-[#EEF0F6]/60 rounded-lg">
					<div className="flex flex-col gap-4 text-xs">
						<div className="flex flex-col gap-2">
							<p className="text-base text-neutral-700">Default:</p>
							<code className="rounded bg-[#D8CFCA] px-2 py-1">{"<SolanaNFTMinter />"}</code>
						</div>
						<div className="flex flex-col gap-2">
							<p className="text-base text-neutral-700">To enable gasless image uploads:</p>
							<code className="rounded bg-[#D8CFCA] px-2 py-1">
								{"<SolanaNFTMinter gasless={ true } />"}
							</code>
							<p className="mt-2">
								If enbaled, you must also set <span className="bg-gray-200 p-1 text-xs">PRIVATE</span>{" "}
								variable in <span className="bg-gray-200 p-1 text-xs">.env.local</span>
							</p>
						</div>
					</div>
				</div>
				<h1 className="text-start text-xl font-bold p-1 rounded-lg bg-[#EEF0F6]/60">Docs</h1>
				<div className="bg-[#EEF0F6]/60 rounded-lg">
					<ul className="list-decimal pl-5">
						<li>
							<a
								className="text-blue-500 hover:text-blue-700 underline"
								href="https://docs.irys.xyz/developer-docs/provenance-toolkit/solana-nft-minter"
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
						<li>
							<a
								className="text-blue-500 hover:text-blue-700 underline"
								href="https://docs.helius.dev/resources/sdks"
								target="_blank"
							>
								Helius docs
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Page;

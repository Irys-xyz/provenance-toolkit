import React, { FC } from "react";
import Uploader from "../components/Uploader";

const Page: FC = () => {
	return (
		<div className="mx-auto py-10 bg-background text-text flex flex-col-reverse gap-10 md:flex-row justify-center items-start">
			<div className="p-10 w-full md:w-1/3 md:p-0">
				<Uploader gasless={true} />
			</div>

			<div className="flex flex-col space-y-4 p-5 rounded-lg border">
				<h1 className="text-start text-xl font-bold p-1 rounded-lg bg-[#EEF0F6]/60">Overview</h1>
				<div className="bg-[#EEF0F6]/60 rounded-lg">
					<h2 className="font-bold">This component:</h2>
					<ul className="list-decimal pl-5">
						<li>Uploads file(s)</li>
						<li>Pays for and signs the upload at the server</li>
						<li>Displays the uploaded file(s) (optionally)</li>
						<li>Displays the upload receipt (optionally)</li>
					</ul>
					<p className="mt-2">
						Before testing, set the <span className="bg-gray-200 p-1 text-xs">PRIVATE_KEY</span> variable in{" "}
						<span className="bg-gray-200 p-1 text-xs">.env.local</span>
					</p>
				</div>
				<h1 className="text-start text-xl font-bold p-1 rounded-lg bg-[#EEF0F6]/60 mt-5">Usage</h1>
				<div className="bg-[#EEF0F6]/60 rounded-lg">
					<div className="flex flex-col gap-4 text-xs">
						<div className="flex flex-col gap-2">
							<p className="text-base text-neutral-700">Default:</p>
							<code className="rounded bg-[#D8CFCA] px-2 py-1">{"<Uploader gasless={true} />"}</code>
						</div>
						<div className="flex flex-col gap-2">
							<p className="text-base text-neutral-700">To hide the image preview:</p>
							<code className="rounded bg-[#D8CFCA] px-2 py-1">
								{"<Uploader gasless={true} showImageView={ false } />"}
							</code>
						</div>
						<div className="flex flex-col gap-2">
							<p className="text-base text-neutral-700">To hide the receipt preview:</p>
							<code className="rounded bg-[#D8CFCA] px-2 py-1">
								{"<Uploader gasless={true} showReceiptView={ false } />"}
							</code>
						</div>
						<div className="gap-2">
							Before testing, set the <span className="bg-gray-200 p-1">PRIVATE_KEY</span> variable in{" "}
							<span className="bg-gray-200 p-1">.env.local</span>
						</div>
					</div>
				</div>
				<h1 className="text-start text-xl font-bold p-1 rounded-lg bg-[#EEF0F6]/60">Docs</h1>
				<div className="bg-[#EEF0F6]/60 rounded-lg">
					<ul className="list-decimal pl-5">
						<li>
							<a
								className="text-blue-500 hover:text-blue-700 underline"
								href="https://docs.irys.xyz/developer-docs/provenance-toolkit/gassless-uploader"
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

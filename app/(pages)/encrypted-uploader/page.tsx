"use client";

import React, { FC } from "react";
import Uploader from "../../components/Uploader";

const Page: FC = () => {
	return (
		<div className="mx-auto py-10 bg-background text-text flex flex-col-reverse gap-10 md:flex-row justify-center items-start">
			null
			{/* 			
			<div className="p-10 w-full md:w-1/3 md:p-0">
				<Uploader showImageView={true} showReceiptView={true} encryptData={true} />
			</div>

			<div className="flex flex-col space-y-4 p-5 rounded-lg border">
				<h1 className="text-start text-xl font-bold p-1 rounded-lg bg-[#EEF0F6]/60">Overview</h1>
				<div className="bg-[#EEF0F6]/60 rounded-lg">
					<h2 className="font-bold">This component:</h2>
					<ul className="list-decimal pl-5">
						<li>
							Encrypts a file using{" "}
							<a
								className="text-blue-500 hover:text-blue-700 underline"
								href="https://litprotocol.com/"
								target="_blank"
							>
								Lit Protocol
							</a>
						</li>
						<li>Uploads a file</li>
						<li>Funds the upload (if necessary)</li>
						<li>Displays the uploaded file(s) (optionally)</li>
						<li>Displays the upload receipt (optionally)</li>
					</ul>
				</div>
				<h1 className="text-start text-xl font-bold p-1 rounded-lg bg-[#EEF0F6]/60 mt-5">Usage</h1>
				<div className="bg-[#EEF0F6]/60 rounded-lg">
					<div className="flex flex-col gap-4 text-xs">
						<div className="flex flex-col gap-2">
							<p className="text-base text-neutral-700">Default:</p>
							<code className="rounded bg-[#D8CFCA] px-2 py-1">{"<Uploader encryptData={true}/>"}</code>
						</div>
						<div className="flex flex-col gap-2">
							<p className="text-base text-neutral-700">To hide the image preview:</p>
							<code className="rounded bg-[#D8CFCA] px-2 py-1">
								{"<Uploader encryptData={true} showImageView={ false } />"}
							</code>
						</div>
						<div className="flex flex-col gap-2">
							<p className="text-base text-neutral-700">To hide the receipt preview:</p>
							<code className="rounded bg-[#D8CFCA] px-2 py-1">
								{"<Uploader encryptData={true} showReceiptView={ false } />"}
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
								href="https://docs.irys.xyz/developer-docs/provenance-toolkit/encrypted-uploader"
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
								href="https://developer.litprotocol.com/v3/"
								target="_blank"
							>
								Lit Protocol docs
							</a>
						</li>
					</ul>
				</div>
			</div> */}
		</div>
	);
};

export default Page;

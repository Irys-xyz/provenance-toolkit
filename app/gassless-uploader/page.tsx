import React, { FC } from "react";

import GasslessUploader from "../components/GasslessUploader";

const Page: FC = () => {
	return (
		<div className="mx-auto py-10 bg-background text-text flex flex-col-reverse md:flex-row justify-center items-center">
			<div className="w-2/3">
				<GasslessUploader showImageView={true} showReceiptView={true} />
			</div>

			<div className="w-1/3 flex flex-col text-xs space-y-1 items-start">
				<h1 className="text-2xl font-bold rounded-xl mb-3">Usage example:</h1>

				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<p className="text-base text-neutral-700">To hide the image preview:</p>
						<code className="rounded bg-[#D8CFCA] px-2 py-1">
							{"<GasslessUploader showImageView={ false } />"}
						</code>
					</div>
					<div className="flex flex-col gap-2">
						<p className="text-base text-neutral-700">To hide the receipt preview:</p>
						<code className="rounded bg-[#D8CFCA] px-2 py-1">
							{"<GasslessUploader showReceiptView={ false } />"}
						</code>
					</div>
					<div className="gap-2">
						Before testing, set the <span className="bg-gray-200 p-1">PRIVATE_KEY</span> variable in{" "}
						<span className="bg-gray-200 p-1">.env.local</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;

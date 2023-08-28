import React, { FC } from "react";

import Uploader from "../components/Uploader";

const Page: FC = () => {
	return (
		<div className="mx-auto py-10 bg-background text-text flex flex-col-reverse md:flex-row justify-center items-center">
			<div className="w-2/3">
				<Uploader showImageView={true} showReceiptView={true} />
			</div>

			<div className="w-1/3 flex flex-col text-xs space-y-1 items-start">
				<h1 className="text-2xl font-bold rounded-xl mb-3">Usage example:</h1>

				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<p className="text-base text-neutral-700">To hide the image preview:</p>
						<code className="rounded bg-[#D8CFCA] px-2 py-1">{"<Uploader showImageView={ false } />"}</code>
					</div>
					<div className="flex flex-col gap-2">
						<p className="text-base text-neutral-700">To hide the receipt preview:</p>
						<code className="rounded bg-[#D8CFCA] px-2 py-1">
							{"<Uploader showReceiptView={ false } />"}
						</code>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;

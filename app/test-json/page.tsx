"use client";

import React, { FC, useEffect, useState } from "react";
import ReceiptJSONView from "../components/ReceiptJSONView";
import getBundlr from "../utils/getBundlr";

const Page: FC = () => {
	const [receipt, setReceipt] = useState(null);

	useEffect(() => {
		async function fetchData() {
			const id = "27Di9a-xYMFgMVGX3Gkiz5WCkH_kA0f7sx_ulCNQ0cQ";
			const bundlr = await getBundlr();
			const fetchedReceipt = await bundlr.utils.getReceipt(id);
			setReceipt(fetchedReceipt);
		}

		fetchData();
	}, []);

	return (
		<div className="py-10 bg-background text-text flex justify-center items-center">
			<div className="max-w-xl p-5 bg-gray-100 rounded shadow">
				{receipt ? <ReceiptJSONView data={receipt} /> : <p>Loading...</p>}
			</div>
		</div>
	);
};

export default Page;

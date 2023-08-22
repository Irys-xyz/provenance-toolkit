import React, { FC } from "react";

import UDLUploader from "../components/UDLUploader";

const Page: FC = () => {
	return (
		<div className="py-10 bg-background text-text flex justify-center items-center">
			<UDLUploader />
		</div>
	);
};

export default Page;

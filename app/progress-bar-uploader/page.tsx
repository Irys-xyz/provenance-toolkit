import React, { FC } from "react";

import ProgressBarUploader from "../components/ProgressBarUploader";

const Page: FC = () => {
	return (
		<div className="py-10 bg-background text-text flex justify-center items-center">
			<ProgressBarUploader />
		</div>
	);
};

export default Page;

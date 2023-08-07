import React, { FC } from "react";
import ProgressBarUploader from "../components/ProgressBarUploader";

const Page: FC = () => {
	return (
		<div className="min-h-screen bg-gray-200 text-text flex justify-center items-center">
			<ProgressBarUploader />
		</div>
	);
};

export default Page;

import React, { FC } from "react";
import Uploader from "../components/Uploader";

const Page: FC = () => {
	return (
		<div className="min-h-screen bg-gray-200 text-text flex justify-center items-center">
			<Uploader />
		</div>
	);
};

export default Page;

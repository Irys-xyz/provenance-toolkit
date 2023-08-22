import React, { FC } from "react";

import GasslessUploader from "../components/GasslessUploader";

const Page: FC = () => {
	return (
		<div className="bg-background text-text flex flex-col justify-center items-center">
			<GasslessUploader />
			<div className="mt-5 ml-5 mr-5">
				Before testing, set the <span className="bg-gray-200 p-1">PRIVATE_KEY</span> variable in{" "}
				<span className="bg-gray-200 p-1">.env.local</span>
			</div>
		</div>
	);
};

export default Page;

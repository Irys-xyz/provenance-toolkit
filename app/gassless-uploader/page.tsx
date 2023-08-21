import React, { FC } from "react";

import GasslessUploader from "../components/GasslessUploader";

const Page: FC = () => {
	return (
		<div className="min-h-screen bg-background text-text flex flex-col justify-center items-center">
			<GasslessUploader />
			<div className="mt-5 ml-5 mr-5">* Before testing, link the Route Handler to a funded wallet</div>
		</div>
	);
};

export default Page;

import Image from "next/image";

export default function Home() {
	return (
		<div className="py-10 bg-background text-text flex flex-col justify-center items-center p-8">
			<div className="text-2xl font-semibold mb-6 mt-10 leading-relaxed max-w-3xl">
				The Bundlr Provenance Toolkit is a NextJS project to help you rapidly build dApps using Bundlr.
			</div>
			<div className="text-xl mb-6 leading-relaxed max-w-3xl text-neutral-600">
				To build with the toolkit, clone or fork the repository and use the components to build your projects.
				The simple UI design allows for heavy customization when adding to your own projects.
			</div>
			<div className="leading-relaxed max-w-3xl">
				The toolkit contains the following components. To learn about how they're built, we have per-component
				tutorials on our docs site.
				<ul className="list-disc mt-4 ml-4">
					<li>
						Fund / Withdraw:<span className="text-neutral-600"> Fund nodes and withdraw excess funds.</span>
					</li>
					<li>
						Uploader:<span className="text-neutral-600"> Upload single files or groups of files.</span>
					</li>
					<li>
						Progress Bar Uploader:
						<span className="text-neutral-600">
							{" "}
							Upload large files, and provide feedback with a progress bar.
						</span>
					</li>
					<li>
						UDL Uploader:<span className="text-neutral-600"> Upload files and attach a UDL.</span>
					</li>
					<li>
						Gasless Uploader:<span className="text-neutral-600"> Pay for user uploads server-side.</span>
					</li>
					<li>
						Transaction Feed:
						<span className="text-neutral-600">
							{" "}
							Query Bundlr nodes for transactions that meet your criteria.
						</span>
					</li>
				</ul>
			</div>
		</div>
	);
} // Hom

import Image from "next/image";

export default function Home() {
	return (
		<div className="py-10 bg-background text-text flex flex-col justify-center items-center p-8">
			<div className="text-2xl font-semibold mb-6 mt-20 pt-10 leading-relaxed max-w-3xl">
				The Bundlr Provenance Toolkit is a NextJS project to help you rapidly build dApps using Bundlr.
			</div>
			<div className="text-xl mb-6 leading-relaxed max-w-3xl">
				To build with the toolkit, clone or fork the repository and use the components to build your projects.
				The simple UI design allows for heavy customization when adding to your own projects.
			</div>
			<div className="leading-relaxed max-w-3xl">
				The toolkit contains the following components. To learn about how they're built, we have per-component
				tutorials on our docs site.
				<ul className="list-disc mt-4">
					<li>Fund / Withdraw: Fund nodes and withdraw excess funds.</li>
					<li>Uploader: Upload single files or groups of files.</li>
					<li>Progress Bar Uploader: Upload large files, and provide feedback with a progress bar.</li>
					<li>UDL Uploader: Upload files and attach a UDL.</li>
					<li>Gasless Uploader: Pay for user uploads server-side.</li>
					<li>Transaction Feed: Query Bundlr nodes for transactions that meet your criteria.</li>
				</ul>
			</div>
		</div>
	);
} // Home

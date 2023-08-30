# Provenance Toolkit

<div
	className="video mt-5 mb-0"
	style={{
		position: "relative",
		paddingBottom: "56.25%" /* 16:9 */,
		paddingTop: 25,
		height: 0,
	}}
>
	<iframe
		style={{
			position: "absolute",
			top: 0,
			left: 0,
			width: "80%",
			height: "80%",
		}}
		src={`https://www.youtube.com/embed/RWLKUa34VMQ`}
		frameBorder="0"
	/>
</div>

[![Provenance toolkit video](https://github.com/Bundlr-Network/provenance-toolkit/blob/master/assets/Bundlr-Provenance-Toolkit.png?raw=true)](https://www.youtube.com/watch?v=RWLKUa34VMQ)

The [Bundlr Provenance Toolkit](https://docs.bundlr.network/developer-docs/provenance-toolkit) is a collection of UI components you can use to kickstart your next application. It contains UI components for managing node balances, uploading files, performing gassless uploads, and querying transactions.

The toolkit is fully open source, you are welcome to use it any way you want with or without attribution.

## Demo

You can interact with the provenance toolkit at https://provenance-toolkit.bundlr.network

## Prerequisites

The Provenance Toolkit is designed for intermediate to advanced developers and assumes you have a working knowledge of NextJS, TypeScript, and Tailwind. Beginning developers may want to start with our [tutorials](https://docs.bundlr.network/hands-on/tutorials) and [quests](https://docs.bundlr.network/hands-on/quests) which are designed for a broader audience.

This guide gives an introduction to the entire toolkit, including how to use and customize the components. To learn more about how each component is built, we have separate tutorials for each.

## Setup

1. Fork or clone https://github.com/Bundlr-Network/provenance-toolkit
2. Run `npm install` or `yarn` from within the project directory
3. Rename `.env.local.example` to `.env.local` and follow the configuration instructions in that file
4. Run `npm run start` from within the project directory
5. Launch the Provenance Toolkit at http://localhost:3000/

## Project layout

![Toolkit layout](https://github.com/Bundlr-Network/provenance-toolkit/blob/master/assets/provenace-toolkit-layout.png?raw=true)

The project is broken into three main categories:

-   Components: The UI components. These can be added to your project and used as is.
-   Navigation routes: NextJS navigation routing. If you’re building your own project on top of the Provenance Toolkit, you can delete these routes and create your own.
-   Utils: Utility functions used by the UI components.

These are further detailed in our [docs](https://docs.bundlr.network/developer-docs/provenance-toolkit).

## Components

Included within the Provenance Toolkit are the following components:

### Fund / withdaw

![Toolkit layout](https://github.com/Bundlr-Network/provenance-toolkit/blob/master/assets/fund-withdraw1.png?raw=true)

Manage node balances.

### Uploader

![Toolkit layout](https://github.com/Bundlr-Network/provenance-toolkit/blob/master/assets/uploader.png?raw=true)
Upload single files or groups of files.

### Progress bar uploader

![Toolkit layout](https://github.com/Bundlr-Network/provenance-toolkit/blob/master/assets/progress-bar-uploader.png?raw=true)
Upload large files, and provide feedback with a progress bar.

### UDL uploader

![Toolkit layout](https://github.com/Bundlr-Network/provenance-toolkit/blob/master/assets/udl-uploader.png?raw=true)
Upload files and attach a UDL.

### Gassless uploader

![Toolkit layout](https://github.com/Bundlr-Network/provenance-toolkit/blob/master/assets/uploader.png?raw=true)
Pay for user uploads server-side.

### Transaction feed

![Toolkit layout](https://github.com/Bundlr-Network/provenance-toolkit/blob/master/assets/transaction-feed.png?raw=true)
Query Bundlr transactions.

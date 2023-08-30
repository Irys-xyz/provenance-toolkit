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

The Bundlr Provenance Toolkit is a collection of UI components you can use to kickstart your next application. It contains UI components for managing node balances, uploading files, performing gassless uploads, and querying transactions.

The toolkit is fully open source, you are welcome to use it any way you want with or without attribution.

## Demo

You can interact with the provenance toolkit at https://provenance-toolkit.bundlr.network

## Prerequisites

The Provenance Toolkit is designed for intermediate to advanced developers and assumes you have a working knowledge of NextJS, TypeScript, and Tailwind. Beginning developers may want to start with our [tutorials](/hands-on/tutorials) and [quests](/hands-on/quests) which are designed for a broader audience.

This guide gives an introduction to the entire toolkit, including how to use and customize the components. To learn more about how each component is built, we have separate tutorials for each.

## Setup

1. Fork or clone https://github.com/Bundlr-Network/provenance-toolkit
2. Run `npm install` or `yarn` from within the project directory
3. Rename `.env.local.example` to `.env.local` and follow the configuration instructions in that file
4. Run `npm run start` from within the project directory
5. Launch the Provenance Toolkit at http://localhost:3000/

## Project layout

<img
	className="border border-[#FEF4EE] rounded mt-5 md:w-4/6 w-full"
	src="/img/provenance-toolkit/provenace-toolkit-layout.png"
/>

The project is broken into three main categories:

-   Components: The UI components. These can be added to your project and used as is.
-   Navigation routes: NextJS navigation routing. If you’re building your own project on top of the Provenance Toolkit, you can delete these routes and create your own.
-   Utils: Utility functions used by the UI components.

## Components

Included within the Provenance Toolkit are the following components:

-   [Fund / Withdraw](./provenance-toolkit/fund-withdraw): Manage node balances.
-   [Uploader](./provenance-toolkit/uploader): Upload single files or groups of files.
-   [Progress Bar Uploader](./provenance-toolkit/progress-bar-uploader): Upload large files, and provide feedback with a progress bar.
-   [UDL Uploader](./provenance-toolkit/udl-uploader): Upload files and attach a UDL.
-   [Gasless Uploader](./provenance-toolkit/gassless-uploader): Pay for user uploads server-side.
-   [Transaction Feed](./provenance-toolkit/transaction-feed): Query Bundlr transactions.

## Customization

The components are designed with a minimal UI that can be easily incorporated into any design. If you need to make significant UI customizations, the docs for each component contain a description of the code.

To change colors, modify the values in `tailwind.config.js`.

## Utility Functions

The following utility functions are used internally by the components. If you're using the components as-is, you can safely ignore the utility functions. For users customizing the components, these functions provide an additional abstraction layer over our SDK.

-   `titleCase.ts`: Converts a string to title case
-   `getRpcUrl.ts`: Returns the RPC URL for the chain associated with the specified currency.
-   `getBundlr.ts`: Instantiates a Bundlr object using the parameters in `.env.local`. Currently designed to work with the Ethers 5 provider. Yo use a different provider, modify code here.
-   `fundAndUpload.ts`: Determines the upload cost for the specified data, funds the node if needed, and then uploads the file.
-   `gasslessFundAndUpload.ts`: Using the private key supplied in `.env.local`, determines the upload cost for the specified data, funds the node if needed, and then uploads the file.
-   `queryGraphQL.ts`: Builds and executes a Bundlr GraphQL query using the specified parameters.

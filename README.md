# Provenance Toolkit

<a href="https://youtu.be/IEs4ap7I-Kw" rel="noopener" target="_blank">
  <img src="/assets/irys-provenance-toolkit.png" alt="Provenance toolkit video" />
</a>

The [Irys Provenance Toolkit](https://docs.irys.xyz/developer-docs/provenance-toolkit) is a collection of UI components you can use to kickstart your next application. It contains UI components for managing node balances, uploading files, performing gassless uploads, and querying transactions.

The toolkit is fully open source, you are welcome to use it any way you want with or without attribution.

## Docs

For details on how to use (and customize) each component, [refer to our docs](https://docs.irys.xyz/developer-docs/provenance-toolkit).

## Demo

You can interact with the provenance toolkit at https://provenance-toolkit.irys.xyz

## Prerequisites

The Provenance Toolkit is designed for intermediate to advanced developers and assumes you have a working knowledge of NextJS, TypeScript, and Tailwind. Beginning developers may want to start with our [tutorials](https://docs.irys.xyz/hands-on/tutorials) and [quests](https://docs.irys.xyz/hands-on/quests) which are designed for a broader audience.

## Setup

1. Fork or clone https://github.com/Irys-xyz/provenance-toolkit
2. Run `npm install` or `yarn` from within the project directory
3. Rename `.env.local.example` to `.env.local` and follow the configuration instructions in that file
4. Run `npm run start` from within the project directory
5. Launch the Provenance Toolkit at http://localhost:3000/

## Wallets / providers

You can use the Provenance Toolkit with the following wallets:

- Metamask
- Phantom (Solana)

Once you have connected any of those wallets, the toolkit will continue to prompt you to sign transactions using that wallet. If you want to test with a different provider, first disconnect your wallet and then reconnect.

## Project layout

![Toolkit layout](./assets/provenace-toolkit-layout.png?raw=true)

The project is broken into three main categories:

- Components: The UI components. These can be added to your project and used as is.
- Navigation routes: NextJS navigation routing. If you’re building your own project on top of the Provenance Toolkit, you can delete these routes and create your own.
- Utils: Utility functions used by the UI components.

These are further detailed in our [docs](https://docs.irys.xyz/developer-docs/provenance-toolkit).

## Components

Included within the Provenance Toolkit are the following components:

### Fund / withdaw

Manage node balances.

![Toolkit layout](./assets/fund-withdraw1.png?raw=true)

### Uploader

Upload single files or groups of files.

![Toolkit layout](./assets/uploader.png?raw=true)

### Progress bar uploader

Upload large files, and provide feedback with a progress bar.

![Toolkit layout](./assets/progress-bar-uploader2.png?raw=true)

### UDL uploader

Upload files and attach a UDL.

![Toolkit layout](./assets/udl-uploader.png?raw=true)

### Gassless uploader

Pay for user uploads server-side.

![Toolkit layout](./assets/uploader.png?raw=true)

### Transaction feed

Query Irys transactions.

![Toolkit layout](./assets/transanaction-feed.png?raw=true)

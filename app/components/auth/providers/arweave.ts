import { verifyArweave, verifyEthereum } from "../../../components/auth/auth-actions";

import { VERIFICATION_MESSAGE } from "@/app/lib/utils";

export const signInWithArweave = async () => {
	await window.arweaveWallet.connect(["ACCESS_ADDRESS", "ACCESS_PUBLIC_KEY", "SIGNATURE"]);

	const address = await window.arweaveWallet.getActiveAddress();

	const publicKey = await window.arweaveWallet.getActivePublicKey();

	// sign the message
	const signature = await window.arweaveWallet.signMessage(new TextEncoder().encode(VERIFICATION_MESSAGE));
	console.log("🚀 ~ signInWithArweave ~ signature:", signature);

	const signatureBase64 = Buffer.from(signature).toString("base64");

	const authenticated = await verifyArweave({
		address,
		publicKey,
		signature: signatureBase64,
	});

	console.log("🚀 ~ signInWithArweave ~ authenticated:", authenticated);

	// return the account, network, and signature
	return authenticated;
};

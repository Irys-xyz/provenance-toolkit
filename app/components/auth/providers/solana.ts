import { VERIFICATION_MESSAGE } from "@/app/lib/utils";
import bs58 from "bs58";
import { verifySolana } from "../../../components/auth/auth-actions";

export const signInWithSolana = async () => {
	await window.solana.connect();

	const signedMessage = await window.solana.signMessage(new TextEncoder().encode(VERIFICATION_MESSAGE), "utf8");

	const authenticated = await verifySolana({
		publicKey: signedMessage.publicKey.toBase58(),
		signature: bs58.encode(signedMessage.signature),
	});

	return authenticated;
};

import { VERIFICATION_MESSAGE } from "@/app/lib/utils";
import bs58 from "bs58";
import { verifyEthereum } from "../../../components/auth/auth-actions";

export const signInWithMetamask = async () => {
	// get the account
	const accounts = await window.ethereum.request({
		method: "eth_requestAccounts",
	});

	// sign the message
	const signature = await window.ethereum.request({
		method: "personal_sign",
		params: [VERIFICATION_MESSAGE, accounts[0]],
	});

	const authenticated = await verifyEthereum({
		address: accounts[0],
		signature,
	});

	// return the account, network, and signature
	return authenticated;
};

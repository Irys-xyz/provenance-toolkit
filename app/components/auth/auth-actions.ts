"use server";

import { VERIFICATION_MESSAGE } from "@/app/lib/utils";
import bs58 from "bs58";
import { cookies } from "next/headers";
import { env } from "@/app/lib/env";
import nacl from "tweetnacl";
import { sign } from "jsonwebtoken";
import { verifyMessage } from "ethers";

export type AuthJwt = {
	exp: number;
	iat: number;
	verified: boolean;
	address: string;
};

export const verifyEthereum = async ({ signature, address }: { signature: string; address: string }) => {
	if (!signature || !address) throw new Error("Invalid signature or address");

	const verifiedAddress = verifyMessage(VERIFICATION_MESSAGE, signature);

	if (verifiedAddress.toLowerCase() !== address.toLowerCase()) {
		throw new Error("Invalid signature");
	}

	const jwt = sign({ address, verified: true }, env.JWT_SECRET, {
		expiresIn: "1d",
	});

	cookies().set("jwt", jwt, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		path: "/",
	});

	return true;
};

export const verifySolana = async ({ publicKey, signature }: { publicKey: string; signature: string }) => {
	const verified = nacl.sign.detached.verify(
		new TextEncoder().encode(VERIFICATION_MESSAGE),
		bs58.decode(signature),
		bs58.decode(publicKey),
	);

	if (!verified) {
		throw new Error("Invalid signature");
	}

	const jwt = sign({ address: publicKey, verified }, env.JWT_SECRET, {
		expiresIn: "1d",
	});

	cookies().set("jwt", jwt, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		path: "/",
	});

	return true;
};

export const verifyArweave = async ({
	address,
	publicKey,
	signature,
}: {
	address: string;
	publicKey: string;
	signature: any;
}) => {
	const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(VERIFICATION_MESSAGE));

	// import public JWK
	// we need the user's public key for this
	const publicJWK: JsonWebKey = {
		e: "AQAB",
		ext: true,
		kty: "RSA",
		n: publicKey,
	};

	// import public jwk for verification
	const verificationKey = await crypto.subtle.importKey(
		"jwk",
		publicJWK,
		{
			name: "RSA-PSS",
			hash: "SHA-256",
		},
		false,
		["verify"],
	);

	// deconvert signature from base64
	const signatureBuffer = new Uint8Array(Array.from(Buffer.from(signature, "base64")));

	// verify the signature by matching it with the hash
	const verified = await crypto.subtle.verify(
		{ name: "RSA-PSS", saltLength: 32 },
		verificationKey,
		signatureBuffer,
		hash,
	);

	if (!verified) {
		throw new Error("Invalid signature");
	}

	const jwt = sign({ address, verified }, env.JWT_SECRET, {
		expiresIn: "1d",
	});

	cookies().set("jwt", jwt, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		path: "/",
	});

	return true;
};

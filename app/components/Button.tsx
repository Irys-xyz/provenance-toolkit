import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Spinner from "./Spinner";
import { checkAndSignAuthMessage } from "@lit-protocol/lit-node-client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
	scheme?: ButtonScheme;
	checkConnect?: boolean;
	requireLitAuth?: boolean;
}

export enum ButtonScheme {
	black = "black",
	white = "white",
}

const Button: React.FC<ButtonProps> = ({
	children,
	scheme,
	onClick,
	checkConnect = true,
	requireLitAuth = false,
	...props
}) => {
	const [connected, setConnected] = useState(false);
	const [connecting, setConnecting] = useState(false);
	const [hasLitToken, setHasLitToken] = useState(false);

	useEffect(() => {
		if (checkConnect) {
			const checkConnection = async () => {
				//@ts-ignore
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const accounts = await provider.listAccounts();
				setConnected(accounts && accounts.length > 0);
			};

			checkConnection();
		}
	}, [checkConnect]);

	// Separate useEffect for checking 'lit-auth-signature' in local storage
	useEffect(() => {
		if (localStorage.getItem("lit-auth-signature")) {
			setHasLitToken(true);
		}
	}, []);

	const handleConnect = async (event: React.MouseEvent) => {
		event.preventDefault();
		setConnecting(true);
		try {
			//@ts-ignore
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			await provider.send("eth_requestAccounts", []);
			setConnected(true);
		} catch (error) {
			console.error("Failed to connect:", error);
		}
		setConnecting(false);
	};

	// Signs in with LitProtcol, only needed when used with the Uploader in Encrypted node
	const signInLit = async () => {
		// const authSig = await checkAndSignAuthMessage({
		// 	chain: process.env.NEXT_PUBLIC_LIT_CHAIN || "polygon",
		// });
		// console.log("authSig:", authSig);
		// if (authSig) {
		// 	setHasLitToken(true);
		// }
	};

	const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		if (!checkConnect || (connected && onClick)) {
			if (requireLitAuth && !hasLitToken) {
				signInLit();
			} else {
				onClick && onClick(event);
			}
		} else {
			handleConnect(event);
		}
	};

	if (!scheme) scheme = ButtonScheme.black;

	return (
		<button
			{...props}
			type="button"
			className={`
				w-full justify-center text-md flex items-center gap-2 rounded-full px-4 py-3 font-robotoMono uppercase hover:font-bold lg:px-6 lg:py-5
				${
					{
						[ButtonScheme.black]: "bg-black text-white",
						[ButtonScheme.white]: "bg-white text-black",
					}[scheme]
				}
			`}
			onClick={handleButtonClick}
		>
			{checkConnect && !connected ? (
				connecting ? (
					<Spinner color="text-background" />
				) : (
					"Connect Wallet"
				)
			) : requireLitAuth && !hasLitToken ? (
				"Sign In Lit"
			) : (
				children
			)}
		</button>
	);
}; // Button

export default Button;

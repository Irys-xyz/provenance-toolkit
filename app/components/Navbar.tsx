"use client";

import IrysIcon from "./IrysIcon";
import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * NavbarLink properties
 */
interface NavbarLinkProps {
	href: string;
	children: React.ReactNode;
}

const NavbarLink: FC<NavbarLinkProps> = ({ href, children }) => {
	const pathname = usePathname();
	const isActive = pathname === href;
	return (
		<Link
			className={`whitespace-nowrap font-robotoMono hover:font-bold pb-4 px-3 text-neutral-500 ${
				isActive ? "!text-black font-bold border-b-2 border-black" : ""
			}`}
			href={href}
		>
			{children}
		</Link>
	);
};

const Navbar: FC = () => {
	const NAV_LINKS = [
		{
			href: "/fund-withdraw",
			text: "Fund / Withdraw",
		},
		{
			href: "/uploader",
			text: "Uploader",
		},
		{
			href: "/progress-bar-uploader",
			text: "Progress Bar Uploader",
		},
		{
			href: "/gasless-uploader",
			text: "Gasless Uploader",
		},
		{
			href: "/udl-uploader",
			text: "UDL Uploader",
		},
		{
			href: "/encrypted-uploader",
			text: "Encrypted Uploader",
		},
		{
			href: "/transaction-feed",
			text: "Transaction Feed",
		},
	];

	return (
		<header className="w-full bg-background text-text border-b">
			<nav>
				<div className="flex flex-col items-center justify-between w-full">
					<div className="text-lg font-semibold bg-black w-full h-full py-2 text-white text-center">
						<Link className="flex items-center gap-4 cursor-pointer justify-center" href="/">
							<IrysIcon /> <span>Provenance Toolkit</span>
						</Link>
					</div>

					{/* Wrap the navigation links in a container */}
					<div className="flex pt-4 lg:overflow-hidden overflow-x-scroll w-full justify-center">
						<div className="flex space-x-3 justify-center text-sm">
							{NAV_LINKS.map((link, index) => (
								<NavbarLink key={index} href={link.href}>
									{link.text}
								</NavbarLink>
							))}
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Navbar;

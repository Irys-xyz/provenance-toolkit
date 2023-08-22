"use client";

import BundlrIcon from "./BundlrIcon";
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
			className={`font-robotoMono hover:font-bold pb-4 px-3 text-neutral-500 ${isActive ? "!text-black font-bold border-b-2 border-black" : ""
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
			href: "/gassless-uploader",
			text: "Gassless Uploader",
		},
		{
			href: "/udl-uploader",
			text: "UDL Uploader",
		},
		{
			href: "/transaction-feed",
			text: "Transaction Feed",
		},
	];

	return (
		<header className="w-full top-0 left-0 bg-background text-text border-b">
			<nav className="">
				<div className="flex flex-col items-center justify-between">
					<div className="text-lg font-semibold bg-black w-full h-full py-4 text-white text-center">
						<Link className="flex items-center gap-4 cursor-pointer justify-center" href="/">
							<BundlrIcon /> <span className="">Provenance Toolkit</span>
						</Link>
					</div>
					<div className="h-[1px] bg-black w-full" />
					<div className="flex space-x-8 pt-4">
						{NAV_LINKS.map((link, index) => (
							<NavbarLink key={index} href={link.href}>
								{link.text}
							</NavbarLink>
						))}
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Navbar;

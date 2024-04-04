"use client";

import { FC, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import IrysIcon from "./IrysIcon";
import Link from "next/link";

interface DropdownProps {
	title: string;
	links: Array<{
		href: string;
		text: string;
	}>;
}

const Dropdown: FC<DropdownProps> = ({ title, links }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [hoveredItem, setHoveredItem] = useState<string | null>(null);
	const router = usePathname();
	const isOptionActive = (href: string) => {
		return router ? router.startsWith(href) : false;
	};

	return (
		<div
			className="relative font-satoshi"
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => {
				setIsOpen(false);
				setHoveredItem(null);
			}}
		>
			<button
				className={`w-20 flex items-center justify-center text-base whitespace-nowrap font-satoshi pb-4 px-3 text-neutral-500  ${
					isOpen ? "!font-black" : ""
				} ${
					links.some((link) => isOptionActive(link.href)) ? "!font-black !text-black !border-b-2 !border-black" : ""
				}`}
			>
				{title}
			</button>
			{isOpen && (
				<div className="absolute left-0 border p-2 z-50 w-60 bg-background rounded-bl-sm rounded-br-sm">
					{links.map((link: { href: string; text: string }) => (
						<Link
							key={link.href}
							href={link.href}
							className={`text-base cursor-pointer block px-4 py-2 text-gray-700 ${
								hoveredItem === link.href ? "!font-black !text-black" : ""
							} ${isOptionActive(link.href) ? "!font-black" : ""}`}
							onMouseEnter={() => setHoveredItem(link.href)}
							onMouseLeave={() => setHoveredItem(null)}
						>
							{link.text}
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

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
			className={`w-32 flex items-center justify-center text-base whitespace-nowrap font-satoshi hover:font-bold pb-4 px-3 text-neutral-500 ${
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
			title: "Uploading",
			links: [
				{ href: "/uploader", text: "Standard Uploader" },
				{ href: "/progress-bar-uploader", text: "Progress Bar Uploader" },
				{ href: "/gasless-uploader", text: "Gasless Uploader" },
				{ href: "/udl-uploader", text: "UDL Uploader" },
				// { href: "/encrypted-uploader", text: "Encrypted Uploader" },
			],
		},
		{
			title: "NFTs",
			links: [{ href: " /solana-nft-minter", text: "Solana NFT Minter" }],
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
					<div className="flex pt-4  w-full justify-center">
						<div className="flex space-x-10 justify-center text-sm">
							{NAV_LINKS.map((item, index) =>
								"links" in item ? (
									// @ts-ignore
									<Dropdown key={index} title={item.title} links={item.links} />
								) : (
									<NavbarLink key={index} href={item.href}>
										{item.text}
									</NavbarLink>
								),
							)}
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Navbar;

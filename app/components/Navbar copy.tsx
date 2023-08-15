import BundlrIcon from "./BundlrIcon";
import { FC } from "react";
import Link from "next/link";

/**
 * NavbarLink properties
 */
interface NavbarLinkProps {
	href: string;
	children: React.ReactNode;
}

const NavbarLink: FC<NavbarLinkProps> = ({ href, children }) => {
	return (
		<Link
			className="font-robotoMono hover:font-bold"
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
			href: "/udl-uploader",
			text: "UDL Uploader",
		},
		{
			href: "/transaction-feed",
			text: "Transaction Feed",
		},
	];

	return (
		<header className="w-full fixed top-0 z-50 bg-background text-text shadow-xl">
			<nav className="container mx-auto px-6 py-3">
				<div className="flex items-center justify-between min-h-[90px]">
					<div className="text-lg font-semibold">
						<Link className="flex items-center gap-4 cursor-pointer text-text" href="/">
							<BundlrIcon /> <span className="">Provenance Toolkit</span>
						</Link>
					</div>
					<div className="flex space-x-8">
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

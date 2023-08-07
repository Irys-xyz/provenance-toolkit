import { FC } from "react";
import Link from "next/link";

/**
 * NavbarLink properties
 */
interface NavbarLinkProps {
	href: string;
	children: React.ReactNode;
}

/**
 * NavbarLink component
 * @param props NavbarLink properties
 * @returns NavbarLink component
 */
const NavbarLink: FC<NavbarLinkProps> = ({ href, children }) => {
	return (
		<Link
			className="cursor-pointer px-2 py-1 rounded-md border-2 border-background-contrast hover:bg-background-contrast hover:text-background transition-all duration-500 ease-in-out"
			href={href}
		>
			{children}
		</Link>
	);
};

const Navbar: FC = () => {
	return (
		<header className="w-full fixed top-0 z-50 bg-background text-text shadow-xl">
			<nav className="container mx-auto px-6 py-3">
				<div className="flex items-center justify-between">
					<div className="text-lg font-semibold">
						<Link className="cursor-pointer text-text" href="/">
							Bundlr Provenance Toolkit
						</Link>
					</div>
					<div className="flex space-x-4">
						<NavbarLink href="/fund-withdraw">Fund / Withdraw</NavbarLink>
						<NavbarLink href="/uploader">Uploader</NavbarLink>
						<NavbarLink href="/progress-bar-uploader">Progress Bar Uploader</NavbarLink>
						<NavbarLink href="/udl-uploader">UDL Uploader</NavbarLink>
						<NavbarLink href="/transaction-feed">Transaction Feed</NavbarLink>
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Navbar;

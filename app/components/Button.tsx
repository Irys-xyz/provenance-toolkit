import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    scheme?: ButtonScheme;
}

export enum ButtonScheme {
    black = "black",
    white = "white",
}

const Button: React.FC<ButtonProps> = ({ children, scheme, ...props }) => {

    if (!scheme) scheme = ButtonScheme.black

    return (
        <button
            className={`
                w-full justify-center text-md flex items-center gap-2 rounded-full px-4 py-3 font-robotoMono uppercase hover:font-bold lg:px-6 lg:py-5
                ${{
                    [ButtonScheme.black]: "bg-black text-white",
                    [ButtonScheme.white]: "bg-white text-black",
                }[scheme]
                }
`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

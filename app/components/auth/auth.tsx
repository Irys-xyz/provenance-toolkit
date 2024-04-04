"use client";

import { Button } from "../ui/button";
import { signInWithArweave } from "./providers/arweave";
import { signInWithMetamask } from "./providers/metamask";
import { signInWithSolana } from "./providers/solana";
import { useRouter } from "next/navigation";

type Props = {};

const Auth = (props: Props) => {
  const router = useRouter();

  const handleAuth = async ({ method }: { method: () => Promise<boolean> }) => {
    try {
      const valid = await method();
      if (valid) {
        router.push("/rules");
      }
    } catch (error) {
      // handle error
      console.error(error);
    }
  };

  return (
    <div className="text-white flex-col flex">
      <Button
        onClick={() =>
          handleAuth({
            method: signInWithMetamask,
          })
        }
      >
        Login with Metamask
      </Button>
      <Button
        onClick={() =>
          handleAuth({
            method: signInWithSolana,
          })
        }
      >
        Login with Solana
      </Button>
      <Button
        onClick={() =>
          handleAuth({
            method: signInWithArweave,
          })
        }
      >
        Login with Arweave
      </Button>
    </div>
  );
};

export default Auth;

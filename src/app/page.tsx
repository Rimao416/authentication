import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black">
      <div className="space-y-6">
        <h1
          className={cn(
            "text-6xl font-bold text-white drop-shadow-md",
            font.className
          )}
        >
          Auth
        </h1>
        <p className="text-white text-lg">A Simple Authentication Service</p>
        <div>
          <LoginButton>
            <Button variant={"secondary"} size={"lg"}>
              Sign In
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}

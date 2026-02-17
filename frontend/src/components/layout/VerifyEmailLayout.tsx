import VerifyEmail from "@/pages/VerifyEmail";
import Logo from "../ui/Logo";

const VerifyEmailLayout = () => (
  <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
    <div
      style={{
        position: "absolute",
        borderRadius: "50%",
        filter: "blur(80px)",
        opacity: 0.12,
        pointerEvents: "none",
        width: 500,
        height: 500,
        background: "hsl(var(--primary))",
        top: -150,
        right: -100,
      }}
    />
    <header className="relative z-10 flex items-center px-8 py-6">
      <Logo size="md" />
    </header>
    <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md page-enter">
        <VerifyEmail />
      </div>
    </main>
  </div>
);

export default VerifyEmailLayout;

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SocialLoginButton } from "./SocialLoginButton";
import { UserTypeToggle, type UserType } from "./UserTypeToggle";
import { Sparkles } from "lucide-react";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.42-1.7 4.16-5.5 4.16-3.3 0-6-2.74-6-6.11S8.7 6.03 12 6.03c1.88 0 3.14.8 3.86 1.49l2.63-2.53C16.83 3.48 14.63 2.5 12 2.5 6.76 2.5 2.5 6.76 2.5 12S6.76 21.5 12 21.5c6.94 0 9.5-4.88 9.5-9.42 0-.63-.07-1.12-.16-1.88H12Z" />
    </svg>
  );
}

export function LoginCard() {
  const [userType, setUserType] = useState<UserType>("startup");
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate({ to: "/agent-l" });
  };

  const isStartup = userType === "startup";

  return (
    <div className="w-full max-w-md">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-8 shadow-2xl backdrop-blur-xl">
        {/* Card glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />

        <div className="relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            Your AI agent is about to be created
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome to Superconnect</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in and let your AI agent do the matchmaking.
          </p>

          <div className="mt-6">
            <UserTypeToggle value={userType} onChange={setUserType} />
          </div>

          <div className="mt-6 space-y-3">
            <SocialLoginButton
              icon={<LinkedInIcon />}
              label="Continue with LinkedIn"
              emphasized={!isStartup}
              onClick={handleLogin}
            />
            <SocialLoginButton
              icon={<XIcon />}
              label="Continue with X"
              emphasized={isStartup}
              onClick={handleLogin}
            />
            <SocialLoginButton
              icon={<GoogleIcon />}
              label="Continue with Google"
              onClick={handleLogin}
            />
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            By signing in, your AI agent will start learning your profile from your social media.
          </p>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            <a href="#" className="underline-offset-4 hover:text-foreground hover:underline">
              Terms of Service
            </a>
            <span className="mx-2">·</span>
            <a href="#" className="underline-offset-4 hover:text-foreground hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

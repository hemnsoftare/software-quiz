import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6">
        <SignIn
          appearance={{
            elements: {
              footer: "hidden",
              card: "shadow-xl border border-gray-200 rounded-xl",
              headerTitle: "text-2xl font-bold text-gray-800",
              headerSubtitle: "text-gray-600",
              formButtonPrimary:
                "bg-blue-600 hover:bg-blue-700 text-white rounded-lg",
              formFieldInput:
                "rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500",
              dividerLine: "bg-gray-200",
              dividerText: "text-gray-500",
              socialButtonsBlockButton:
                "border border-gray-300 hover:bg-gray-50 rounded-lg",
            },
            layout: {
              socialButtonsPlacement: "bottom",
              privacyPageUrl: "https://your-privacy-page",
              termsPageUrl: "https://your-terms-page",
            },
          }}
        />
      </div>
    </div>
  );
}

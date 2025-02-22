import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              footer: "hidden",
              card: "shadow-none",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
              formFieldInput: "border-2 focus:border-blue-500 rounded-md",
              socialButtonsBlockButton: "border-2 hover:border-gray-300",
              headerTitle: "text-2xl font-bold text-gray-800",
              headerSubtitle: "text-gray-600",
            },
          }}
        />
      </div>
    </div>
  );
}

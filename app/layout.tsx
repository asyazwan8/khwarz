import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import LevelUpToast from "@/components/LevelUpToast";

export const metadata: Metadata = {
  title: "Khwarz",
  description: "SPM Physics practice, one question at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full">
        <StoreProvider>
          <div className="flex h-full overflow-hidden">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <TopBar />
              <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
          <LevelUpToast />
        </StoreProvider>
      </body>
    </html>
  );
}

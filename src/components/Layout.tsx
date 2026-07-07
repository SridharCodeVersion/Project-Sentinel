import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex flex-1 pt-[92px]">
        <Sidebar />
        <main className="flex-1 ml-[240px] h-[calc(100vh-92px)] overflow-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
}

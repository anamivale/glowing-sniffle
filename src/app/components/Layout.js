import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 bg-black text-white">{children}</main>
      </div>
    </div>
  );
}

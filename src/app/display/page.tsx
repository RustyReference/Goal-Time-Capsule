import Navbar from "../components/Navbar";
import Overview from "../components/overview";
/**
 * @returns A component that displays all entries
 */
export default function Display() {
  return (
    <div className="h-screen">
      <Navbar />
      <h1 className="mt-[calc(100vh/8)] text-6xl text-center">Entries</h1>
      <Overview />
    </div>
  );
}
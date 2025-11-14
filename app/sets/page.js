import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import SetsBrowser from "../components/SetsBrowser";
export const dynamic = "force-dynamic";

async function getSets() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/frontend/getsets`
  );
  const data = await res.json();
  return data.data || [];
}

export default async function Sets() {
  const sets = await getSets();
  return (
    <>
      <Header />
      <main className="flex">
        <Sidebar />
        <SetsBrowser sets={sets} />
      </main>
    </>
  );
}

import CardBrowser from "./components/CardBrowser";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
export const dynamic = "force-dynamic";

async function getCards(setName = "me1") {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/frontend/getcards/${setName}/?name=${setName}`
  );
  const data = await res.json();
  return data.data || [];
}

export default async function Home() {
  const initialSet = "me1";
  const cards = await getCards(initialSet);

  return (
    <>
      <Header />
      <main className="flex">
        <Sidebar />

        {/* Cards Browser */}
        <CardBrowser initialCards={cards} initialSet={initialSet} />
      </main>
    </>
  );
}

import CardBrowser from "./components/CardBrowser";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
export const dynamic = "force-dynamic";

async function getCards(setName = "me2") {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/frontend/getcards/${setName}/?name=${setName}`
  );
  const data = await res.json();
  return data.data || [];
}

async function getSets() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/frontend/getsets`
  );
  const data = await res.json();
  return data.data || [];
}

export default async function Home() {
  const initialSet = "me2";
  const cards = await getCards(initialSet);
  const sets = await getSets();

  return (
    <>
      <Header />
      <main className="flex">
        <Sidebar />

        {/* Cards Browser */}
        <CardBrowser
          initialCards={cards}
          initialSet={initialSet}
          allSets={sets}
        />
      </main>
    </>
  );
}

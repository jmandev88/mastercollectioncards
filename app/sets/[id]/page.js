import Header from "../../layout/Header";
import Sidebar from "../../layout/Sidebar";
import SingleSetBrowser from "mcc/app/components/SingleSetBrowser";
export const dynamic = "force-dynamic";

async function getCards(setName) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/frontend/getcards/${setName}/?name=${setName}`
  );
  const data = await res.json();
  return data.data || [];
}

async function getSet(setName) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/frontend/getsets/${setName}/?name=${setName}`
  );
  const data = await res.json();
  return data.data || [];
}

export default async function Sets({ params }) {
  const { id } = await params;

  // Fetch cards for that set
  const cards = await getCards(id);
  const set = await getSet(id);

  return (
    <>
      <Header />
      <main className="flex">
        <Sidebar />
        <SingleSetBrowser
          initialCards={cards}
          initialSet={id}
          setDetails={set}
        />
      </main>
    </>
  );
}

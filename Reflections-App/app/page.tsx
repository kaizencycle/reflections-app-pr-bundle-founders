// app/page.tsx
import AppLayout from "@/components/AppLayout";
import Companions from "@/components/Companions"; // your list (Jade, Hermes, Eve, Zeus)
import Chat from "@/components/Chat";

export default function Page() {
  return (
    <AppLayout sidebar={<Companions />}>
      <Chat />
    </AppLayout>
  );
}

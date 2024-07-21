import Image from "next/image";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();
  // console.log(session?.user);
  return (
    <div>
      {session && (
        <p>
        Welcome {session.user?.name}!
        </p>
      )}
      
      Home</div>
  );
}

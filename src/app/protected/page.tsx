import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ProtectedRoute() {
    const session = await getServerSession();
    console.log(session?.user);
    // console.log(session?.user?.name);
    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    return (
        <div>
            This is a protected route.
            <br />You are authenticated.
        </div>
    );
}
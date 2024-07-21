"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

function AuthButton() {
    const { data: session } = useSession();

    if (session) {
        return (
            <div className="m-10">
                <div className="flex gap-10 mb-10">
                    <Link href="/">
                        <p className="text-xl hover:text-blue-400">
                            Home
                        </p>
                    </Link>
                    <Link href="/account">
                        <p className="text-xl hover:text-blue-400">
                            Account
                        </p>
                    </Link>
                    <Link href="/discover">
                        <p className="text-xl hover:text-blue-400">
                            Discover
                        </p>
                    </Link>
               
                <button className=" text-xl hover:text-blue-400" onClick={() => signOut()}>Sign out</button>
                </div>
            </div>
        );
    }
    return (
        <>
            Not Signed in <br />
            <button className="text-xl hover:text-blue-400" onClick={() => signIn()}>Sign in</button>
        </>
    );
}

export default function NavMenu() {
    return (
        <div className="mb-10">
            <AuthButton />
        </div>
    );
}
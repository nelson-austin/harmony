import { sendFriendRequest, removeFriend, acceptFriendRequest, cancelFriendRequest } from "@/lib/dataFriends";
import { getPlaylists } from "@/lib/dataUser";
import Link from "next/link";
import { Playlist } from "@/lib/interface";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, useRouter } from "next/navigation";
import FriendStatus from "@/app/profile/FriendStatus";
import { getFriendStatus } from "@/lib/dataFriends";
import { useState } from "react";

export default async function Profile({ searchParams, params }: { searchParams?: { action?: string; }, params: { id: string; } }) {
    const id = params.id;
    const action = searchParams?.action;
    const playlists: any = await getPlaylists(id);
    const session = await getServerSession(authOptions);
    let status = await getFriendStatus(session.user.id, id);
    console.log("action", searchParams?.action);
    

    if (session.user.id == id) {
        redirect("/account");
    }

    switch (action) {
        case "send":
            sendFriendRequest(session.user.id, id);
            status = "requested";
            break;
        case "remove":
            removeFriend(session.user.id, id);
            status = "not friends";
            break;
        case "accept":
            acceptFriendRequest(session.user.id, id);
            status = "friends";
            break;
        case "cancel":
            cancelFriendRequest(session.user.id, id);
            status = "not friends";
            break;

        default:
            break;
    }

    return (
        <div>
            <FriendStatus userId={session.user.id} id={id} status={status} />
            <h1>User Playlists</h1>

            {playlists?.map((playlist: Playlist) => (
                <Link href={`/playlists/${playlist.id}`}>
                    
                    <div className="border-2 border-gray-200 p-4 rounded-md">
                        <h2>{playlist.playlist_name}</h2>
                        <p>{playlist.info}</p>
                        {/* <p>Number of tracks: {playlist.tracks.length}</p> */}
                    </div>
                </Link>
            ))}

        </div>
    )
}
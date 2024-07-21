import Link from "next/link"
import { redirect } from "next/navigation";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getPlaylists } from "@/lib/dataUser";
import { Anthem, Playlist } from "@/lib/interface";
import { searchSpotifySongs, getSpotifyAccessToken, getMyTopArtists } from "@/lib/dataSpotify";
import FeaturedSong from "@/app/account/FeaturedSong";
import { getUserAnthem, addAnthem, removeAnthem } from "@/lib/dataAnthem";


export default async function Account({ searchParams }: { searchParams?: { 
    query: string;
    action: string;
    name: string;
    artist: string;
    image: string;
    } }) {

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return (
            <>
                <h1>Login to view your profile data</h1>
            </>
        );
    }

    // const topArtist = await getMyTopArtists(session.accessToken);
    // console.log("data: ", data);
    const token = await getSpotifyAccessToken();
    let anthem: any = await getUserAnthem(session.user.id);
    let searchResults;
    if (searchParams) {
        searchResults = await searchSpotifySongs(token.access_token, searchParams.query);
        console.log("search", searchResults[0].album.images);
    }
    
    if (searchParams?.action === 'add') {
        await removeAnthem(session.user.id);
        await addAnthem(session.user.id, { name: searchParams.name, artist: searchParams.artist, image: searchParams.image });
        anthem = { name: searchParams.name, artist: searchParams.artist, image: searchParams.image };
    }

    const playlists: any = await getPlaylists(session.user.id);
    // console.log("playlists", playlists);
    return (
        <div>

            <h1 className="text-3xl">My Account</h1>
            <div className="grid grid-cols-[1fr_1fr] gap-10">
                <div className="w-full">
                {session.user.image && (
                <Image
                src={session.user?.image}
                alt={session.user?.name!}
                width={100}
                height={100}
                className="w-[100px] rounded-full float-right"
                />
                )}
                </div>
                <div className="flex justify-center flex-col text-xl">
                    <p className="p-1">Name: {session.user?.name}</p>
                    <p className="p-1">email: {session.user?.email}</p>

                </div>
            </div>
            <div>
                <h1>My Playlists</h1>
                {playlists?.map((playlist: Playlist) => (
                    <Link href={`/playlists/${playlist.id}`}>
                        
                        <div className="border-2 border-gray-200 p-4 rounded-md">
                            <h2>{playlist.playlist_name}</h2>
                            <p>{playlist.info}</p>
                            {/* <p>Number of tracks: {playlist.tracks.length}</p> */}
                        </div>
                    </Link>
                ))}
                <div className="my-10">
                    <h1>My top artists</h1>
                    {/* <p>{topArtist.name}</p> */}
                    <p>no data to show</p>
                </div>
                <FeaturedSong  searchResults={searchResults} anthem={anthem}/>
            </div>
        </div>
    );
}
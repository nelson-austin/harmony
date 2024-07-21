import { getSpotifyAccessToken } from "@/lib/dataSpotify";
import { getSpotifySongs } from "@/lib/dataSpotify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";
import { Song } from "@/lib/interface";
import Link from "next/link";

export default async function Songs({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const id = params.id
    const token = await getSpotifyAccessToken();
    const songs: Song[] = await getSpotifySongs(token.access_token, id);
    

    return (
        <>
        <h1>Songs in Playlist {id}</h1>
        <Link
        href={`https://open.spotify.com/playlist/${id}`}>
            Open in Spotify
        </Link>
        
        {songs?.map((element) => (
            <div>
                <Image
                src={element.track.album.images[0].url}
                alt={element.track.name}
                width={element.track.album.images[0].width}
                height={element.track.album.images[0].height}
                />
                <p>name: {element.track.name}</p>
                <p>url: {element.track.album.images[0].url}</p>
            </div>
        ))}
        </>  
       
    );
}
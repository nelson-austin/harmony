"use client";

import Search from "@/app/Search";
import { Track, Anthem } from "@/lib/interface";
import Image from "next/image";
import { useState } from "react";
import { addAnthem } from "@/lib/dataAnthem";
import { redirect, usePathname, useSearchParams, useRouter } from 'next/navigation';

export default function FeaturedSong({searchResults, anthem}: {searchResults: Track[], anthem: Anthem }) {

    const [searchOpen, setSearchOpen] = useState(false);

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    if (searchOpen) {
        return (
            <>
            <div className="flex gap-10">
                <Search placeholder="search songs" />
                <button onClick={() => setSearchOpen(false)}>Close Search</button>
            </div>
            {searchResults?.map((track: Track) => (
                <div className="flex gap-7 my-4">
                <Image
                src={track.album.images[0].url}
                width={100}
                height={100}
                alt={"image of " + track.name} />
                <p>{track.name} - {track.artists[0].name}</p>
                <button onClick={() => { 
                    const params = new URLSearchParams(searchParams);
                    params.set("action", "add");
                    params.set("name", track.name);
                    params.set("artist", track.artists[0].name);
                    params.set("image", track.album.images[0].url);
                    router.push(`${pathname}?${params.toString()}`);
                    setSearchOpen(false)} }>
                Select song</button>
                </div>
            ))}
            </>
        )
    }
 return (
    <>
    <h1 className="text-xl my-2">My Anthem</h1>
    {anthem != null && (
        <div className="flex gap-7">
        <Image
        src={anthem.image}
        width={100}
        height={100}
        alt={"image of " + anthem.name} />
        <p>{anthem.name} - {anthem.artist}</p>
        </div>
    )}
    <button onClick={() => setSearchOpen(true)}>Change Anthem</button>
    </>
 )
}
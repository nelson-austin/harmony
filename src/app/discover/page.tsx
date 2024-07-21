import Search from "@/app/Search";
import { searchFriends } from "@/lib/dataFriends";
import Link from "next/link";
import { Friend } from "@/lib/interface";
export default async function Discover({ searchParams }: {searchParams?: { query?: string; } }) {
    const query = searchParams?.query || '';
    // console.log("search", query);
    let results:any = [];
    if (query.trim() != '') {
        results = await searchFriends(query);
    }
    console.log("results", results);
    return (
        // <h1>discover music from my groups and friends</h1>
        <div>
            <Search placeholder="Search for friends" />
            {results.map((friend: Friend) => (
                <Link href={`profile/${friend.id}`} key={friend.id}>
                    <h2>{friend.name}</h2>
                </Link>
            ))}
        </div>
    )
}
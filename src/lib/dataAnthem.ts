import { sql } from "@vercel/postgres";
import { revalidatePath, unstable_noStore } from "next/cache";
import { User, Playlist, Anthem } from "@/lib/interface";


export async function getUserAnthem(userid: string) {
    unstable_noStore();
    try {
        const data = await sql`
        SELECT * FROM favorite_songs WHERE user_id = ${userid};
        `;
        return data.rows[0];
    } catch (error) {
        return {
            message: "Database Error: Failed to Fetch User Anthem.",
        };
    }
}

export async function removeAnthem(userId: string) {
    try {
        await sql`
        DELETE FROM favorite_songs WHERE user_id = ${userId};
        `;
        return { message: "Anthem removed successfully." };
    } catch (error) {
        return {
            message: "Database Error: Failed to Remove Anthem.",
        };
    }
}

export async function addAnthem(userId: string, song: Anthem) {
    try {
        await sql`
        INSERT INTO favorite_songs (user_id, name, artist, image)
        VALUES (${userId}, ${song.name}, ${song.artist}, ${song.image});
        `;
    } catch (error) {
        console.error("Error adding anthem:", error);
        throw new Error("Failed to add anthem");
    }
}

// export async function newPlaylist(playlist: Playlist) {
//     try {
//         await sql`
//         INSERT INTO playlists (user_id, provider, playlist_name, info)
//         VALUES (${playlist.userId}, ${playlist.provider}, ${playlist.playlist_name}, ${playlist.info});
//         `;
//         return { message: "Playlist created successfully." };
//     } catch (error) {
//         return {
//             message: "Database Error: Failed to Create Playlist.",
//         };
//     }
// }
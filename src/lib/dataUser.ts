import { sql } from "@vercel/postgres";
import { revalidatePath, unstable_noStore } from "next/cache";
import { User, Playlist } from "@/lib/interface";

export async function createProfile(user: User) {
    
  try {
    await sql`
    INSERT INTO users (name, email, image)
        VALUES (${user.name}, ${user.email}, ${user.image})
        ON CONFLICT (email) DO NOTHING;
    `;
  } catch (error) {
    return {
        message: "Database Error: Failed to Create User.",
    };
  }
}

export async function getUserId(email: string) {
  // unstable_noStore();
  try {
    const data = await sql`
        SELECT id FROM users
        WHERE email = ${email}`;
        
    return data.rows[0].id;
  } catch (error) {
    return {
      message: "Database Error: Failed to Fetch UserId.",
  };
  }
}

export async function deletePlaylists(email: string) {
  try {
    await sql`
    DELETE FROM playlists
    WHERE user_id =
    (SELECT user_id FROM users WHERE email = ${email});
    `;

  } catch (error) {
    return {
      message: "Database Error: Failed to Delete Playlists.",
    };
  }
}

export async function savePlaylist(playlistData: any) {
  try {

    await sql`
    INSERT INTO playlists (id, user_id, provider, playlist_name, info)
    VALUES (${playlistData.id}, ${playlistData.user_id}, ${playlistData.provider}, ${playlistData.name}, ${playlistData.description})
    ON CONFLICT (id) DO NOTHING;
    `;
    
  } catch (error) {
    return {
      message: "Database Error: Failed to Save Playlists.",
    };
  }
}

export async function getPlaylists(user_id: string) {
  try {
    const data = await sql<Playlist>`
    SELECT id, playlist_name, provider, info FROM playlists
    WHERE user_id = ${user_id}`;
    return data.rows;
  } catch (error) {
    return {
      message: "Database Error: Failed to Fetch Playlists.",
    };
  }
}

export async function deleteArtist(email: string) {
  try {
    await sql`
    DELETE FROM artists
    WHERE user_id =
    (SELECT user_id FROM users WHERE email = ${email});
    `;

  } catch (error) {
    return {
      message: "Database Error: Failed to Delete Artists.",
    };
  }
}

export async function saveArtist(user_id: string, artist: string, image: string) {
  try {

    await sql`
    INSERT INTO artists (user_id, artist, image)
    VALUES (${user_id}, ${artist}, ${image})
    ON CONFLICT (user_id) DO NOTHING;
    `;
    
  } catch (error) {
    return {
      message: "Database Error: Failed to Save Playlists.",
    };
  }
}
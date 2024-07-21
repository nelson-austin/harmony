import { savePlaylist, saveArtist } from "@/lib/dataUser";


export async function getSpotifyAccessToken() {
    try {
        const body = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.SPOTIFY_CLIENT_ID ?? "",
            client_secret: process.env.SPOTIFY_CLIENT_SECRET ?? "",
        });
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching Spotify access token:", error);
        throw new Error("Failed to fetch Spotify access token");
    }
}

export async function getMySpotifyId(accessToken: string) {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching user ID:", error);
    throw new Error("Failed to fetch user ID");
  }
}

// export async function getSpotifyProfile(accessToken: string) {
//     // let accessToken = localStorage.getItem('access_token');
//   try {
//     const response = await fetch('https://api.spotify.com/v1/me', {
//       headers: {
//         Authorization: 'Bearer ' + accessToken
//       }
//     });
  
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching user profile:", error);
//     throw new Error("Failed to fetch user profile");
//   }
// }

export async function getMySpotifyPlaylists(accessToken: string, user_id: string) {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });

    const data = await response.json();

    const playlists = data.items.map((item: any) => ({
      id: item.id,
      user_id: user_id,
      provider: "spotify",
      name: item.name,
      description: item.description,
      
    }));

    for (let i = 0; i < playlists.length; i++) {
      await savePlaylist(playlists[i]);
      console.log("Saved playlist", playlists[i]);
    }

    return playlists;

  } catch (error) {
    console.error("Error fetching user playlists:", error);
    throw new Error("Failed to fetch user playlists");
  }
  
}

export async function getSpotifySongs(accessToken: string, id: string) {
 
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });
    const data = await response.json();
    

    return data.items;
  } catch (error) {
    console.error("Error fetching playlist data:", error);
    throw new Error("Failed to fetch playlist data");
  }
}

export async function searchSpotifySongs(accessToken: string, query: string) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/search?query=${query}&type=track&market=us&limit=10&offset=0`, {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });
    const data = await response.json();
    return data.tracks.items;
  } catch (error) {
    console.error("Error searching spotify catalog:", error);
    throw new Error("Failed to search spotify catalog");
  }
}

export async function getMyTopArtists(accessToken: string, user_id: string) {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=1', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    const data = await response.json();
    
    await saveArtist(user_id, data.items[0].name, data.items[0].images);
    return data.items;
  } catch (error) {
    console.error("Error fetching user top artists:", error);
    throw new Error("Failed to fetch user top artists");
  }
}
import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import SpotifyProvider from "next-auth/providers/spotify";
import AppleProvider from "next-auth/providers/apple";
import { createProfile, deletePlaylists, getUserId, savePlaylist, deleteArtist } from '@/lib/dataUser';
import { getMySpotifyPlaylists, getSpotifyAccessToken, getMyTopArtists } from '@/lib/dataSpotify';

const scopes = [
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
  "user-library-modify",
  "user-library-read",
  "user-read-email",
  "user-top-read"
  // "user-top-artists"
].join(",");

const params = {
  scope: scopes
}

const LOGIN_URL = "https://accounts.spotify.com/authorize?" + new URLSearchParams(params).toString();

export const authOptions = {
  providers: [
    
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),

    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID ?? "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? "",
      authorization: LOGIN_URL,
      // authorization: "https://accounts.spotify.com/authorize?scope=playlist-read-private,playlist-read-collaborative,playlist-modify-private,playlist-modify-public,user-library-modify,user-library-read,user-read-email",
      profile(profile) {
        return {
          id: profile.id,
          name: profile.display_name,
          email: profile.email,
          image: profile.images?.[0]?.url
        }
      },
    }),
    
    AppleProvider({
      clientId: process.env.APPLE_ID ?? "",
      clientSecret: process.env.APPLE_SECRET ?? ""
    }),
  ],
  
  // secret: process.env.JWT_SECRET,
  callbacks: {
    async signIn({ user, account}) {

      await createProfile(user);
      const id = await getUserId(user.email);
      

      switch (account.provider) {
        case "google":
          break;
        case "spotify":
          await deletePlaylists(user.email);
          await getMySpotifyPlaylists(account.access_token, id);
          // await deleteArtist(user.email);
          // await getMyTopArtists(account.access_token, id);
          break;
        case "apple":
          break;
        default:
          break;
      }
      
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        // token.id = account.id;
        token.accessToken = account.access_token;
        // token.email = account.email;
        // token.image = account.image;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = await getUserId(session.user.email);
      
      return session;
    },
  },
  // session: {
  //   strategy: "jwt",  
  //   maxAge: 3600, // 1 hour
  // },
  // jwt: {
  //   signingKey: process.env.JWT_SECRET,
  // },
  // Optional SQL or MongoDB database to persist users
//   database: process.env.DATABASE_URL
}
export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

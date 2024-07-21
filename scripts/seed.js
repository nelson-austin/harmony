const { db } = require('@vercel/postgres');

const {
  users,
  songs,
  favorite_songs,
  playlists,
  playlists_songs,
  friends,
  friend_requests,
  artists
} = require('./placeholder-data.js')
const bcrypt = require('bcrypt');
const { isSetAccessorDeclaration } = require('typescript');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        image VARCHAR(255) NULL
      );
    `;

    console.log(`Created "users" table`);

    //Seed the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        // const hashedPassword = await bcrypt.hash(await user.password, 10);
        return client.sql`
        INSERT INTO users (name, email, image)
        VALUES (${user.name}, ${user.email}, ${user.image})
        ON CONFLICT (email) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };

  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};


async function seedSongs(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "songs" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS songs (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        artist VARCHAR(255) NOT NULL,
        genre VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "songs" table`);

    //Seed the "songs" table
    const insertedSongs = await Promise.all(
      songs.map(async (song) => {
        return client.sql`
        INSERT INTO songs (id, name, artist, genre)
        VALUES (${song.id}, ${song.name}, ${song.artist}, ${song.genre})
        ON CONFLICT (ID) DO NOTHING;
      `
      }),
    );

    console.log(`Seeded ${insertedSongs.length} songs`);

    return {
      createTable,
      songs: insertedSongs,
    };

  } catch (error) {
    console.error('Error seeding songs:', error);
    throw error;
  }
};


async function seedFavoriteSongs(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "favorite_songs" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS favorite_songs (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        name VARCHAR(255),
        artist VARCHAR(255),
        image VARCHAR(255) NULL
      );
    `;
    console.log(`Created "favorite_songs" table`);

    //Seed the "liked_songs" table
    const insertedFavoriteSongs = await Promise.all(
      favorite_songs.map(async (song) => {
        return client.sql`
        INSERT INTO favorite_songs (user_id, name, artist, image)
        VALUES (${song.user_id}, ${song.name}, ${song.artist}, ${song.image}))
        ON CONFLICT (ID) DO NOTHING;
      `
      }),
    );

    console.log(`Seeded ${insertedFavoriteSongs.length} favorite_songs`);

    return {
      createTable,
      favorite_songs: insertedFavoriteSongs,
    };

    } catch (error) {
    console.error('Error seeding favorite_songs:', error);
    throw error;
  }
};

async function seedPlaylists(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "playlists" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS playlists (
        id VARCHAR(255) UNIQUE NOT NULL PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        provider VARCHAR(255) NOT NULL,
        playlist_name VARCHAR(255) NOT NULL,
        info text,
        public boolean NULL
      );
    `;

    console.log(`Created "playlists" table`);
    //Seed the "playlists" table
    const insertedPlaylists = await Promise.all(
      playlists.map(async (playlist) => {
        return client.sql`
        INSERT INTO playlists (id, user_id, provider, playlist_name, info)
        VALUES (${playlist.id}, ${playlist.user_id}, ${playlist.provider}, ${playlist.playlist_name}, ${playlist.info})
        ON CONFLICT (ID) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedPlaylists.length} playlists`);

    return {
      createTable,
      playlists: insertedPlaylists,
    };

  } catch (error) {
    console.error('Error seeding playlists:', error);
    throw error;
  }
};

async function seedPlaylistsSongs (client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS playlists_songs (
        id SERIAL PRIMARY KEY,
        playlist_id VARCHAR(255) REFERENCES playlists(id),
        song_id VARCHAR(255) REFERENCES songs(id)
      );
    `;
    
    console.log((`Created "playlists_songs" table`));

    const insertedPlaylistsSongs = await Promise.all(
      playlists_songs.map(async (item) => {
        return client.sql`
          INSERT INTO playlists_songs (playlist_id, song_id)
          VALUES (${item.playlist_id}, ${item.song_id})
          ON CONFLICT (ID) DO NOTHING;
        `;
      })
    );

    console.log(`Seeded ${insertedPlaylistsSongs.length} playlists_songs`)

    return {
      createTable,
      playlists_songs: insertedPlaylistsSongs,
    };
  } catch (error) {
    console.error('Error seeding playlists_songs: ', error);
    throw error;
  }
}

async function seedFriends(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    //create the "friends" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS friends (
        id SERIAL PRIMARY KEY,
        first_friend UUID REFERENCES users(id),
        second_friend UUID REFERENCES users(id)
      );
    `;
    console.log(`Created "friends" table`)
    //Seed the "friends" table
    const insertedFriends = await Promise.all(
      friends.map(async (friend) => {
        return client.sql`
          INSERT INTO friends (first_friend, second_friend)
          VALUES (${friend.first_friend}, ${friend.second_friend})
          ON CONFLICT (ID) DO NOTHING;
        `;
      }),
    );
    
    console.log(`Seeded ${insertedFriends.length} friends`);
    
    return {
      createTable,
      friends: insertedFriends,
    };
    
  } catch (error) {
    console.error('Error seeding friends: ', error);
    throw error;
  }
};

async function seedFriendRequests(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    //create the "friend_requests" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS friend_requests (
        id SERIAL PRIMARY KEY,
        from_user_id UUID REFERENCES users(id),
        to_user_id UUID REFERENCES users(id)
      );
    `;
    console.log(`Created "friend_requests" table`)
    //Seed the "friend_requests" table
    const insertedFriendRequests = await Promise.all(
      friend_requests.map(async (item) => {
        return client.sql`
          INSERT INTO friend_requests (from_user_id, to_user_id)
          VALUES (${item.from_user_id}, ${item.to_user_id})
          ON CONFLICT (ID) DO NOTHING;
        `;
      }),
    );
    
    console.log(`Seeded ${insertedFriendRequests.length} friend_requests`);
    
    return {
      createTable,
      friend_requests: insertedFriendRequests,
    };
    
  } catch (error) {
    console.error('Error seeding friend_requests: ', error);
    throw error;
  }
};

async function seedArtists(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS artists (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        artist_name VARCHAR(255),
        image VARCHAR(255) NULL
      );
    `;

    console.log(`Created "artists" table`);

    //Seed the "users" table
    const insertedArtists = await Promise.all(
      users.map(async (artist) => {
        // const hashedPassword = await bcrypt.hash(await user.password, 10);
        return client.sql`
        INSERT INTO users (user_id, artist_name, image)
        VALUES (${artist.user_id}, ${artist.artist_name}, ${artist.image})
        ON CONFLICT (user_id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedArtists.length} users`);

    return {
      createTable,
      artists: insertedArtists,
    };

  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}


async function main() {
    const client = await db.connect();

    await seedUsers(client);
    await seedSongs(client);
    await seedFavoriteSongs(client);
    await seedPlaylists(client);
    await seedPlaylistsSongs(client);
    await seedFriends(client);
    await seedFriendRequests(client);
    // await seedArtists(client);

    await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
import { sql } from "@vercel/postgres";
import { unstable_noStore } from "next/cache";

export async function getFriendStatus(user_id: string, friend_id: string) {
    
    try {
        const sent = await sql`
        SELECT EXISTS(SELECT * FROM friend_requests
        WHERE from_user_id = ${user_id} AND to_user_id = ${friend_id});
        `;
        if (sent.rows[0].exists) {
            console.log(sent.rows[0].exists);
            return 'requested';
        }

        const received = await sql`
        SELECT EXISTS(SELECT * FROM friend_requests
        WHERE to_user_id = ${user_id} AND from_user_id = ${friend_id});
        `;
        if (received.rows[0].exists) {
            return 'received';
        }

        const friends = await sql`
        SELECT EXISTS(SELECT * FROM friends
        WHERE first_friend = ${user_id} AND second_friend = ${friend_id}
        OR first_friend = ${friend_id} AND second_friend = ${user_id});
        `;
        if (friends.rows[0].exists) {
            return 'friends';
        }
        
        return 'not friends';
    } catch (error) {
        console.error("Error fetching friend status:", error);
        throw new Error("Failed to fetch friend status");
    }
}

export async function sendFriendRequest(from_user_id: string, to_user_id: string) {
    console.log('there was an attempt');
    try {
        await sql`
        INSERT INTO friend_requests (from_user_id, to_user_id)
        VALUES (${from_user_id}, ${to_user_id});
        `;
    } catch (error) {
        console.error("Error sending friend request:", error);
        throw new Error("Failed to send friend request");
    }
}

export async function acceptFriendRequest(to_user_id: string, from_user_id: string) {
    try {
        await sql`
        DELETE FROM friend_requests
        WHERE from_user_id = ${from_user_id} AND to_user_id = ${to_user_id};

        INSERT INTO friends (first_friend, second_friend)
        VALUES (${from_user_id}, ${to_user_id});
        `;
    } catch (error) {
        console.error("Error accepting friend request:", error);
        throw new Error("Failed to accept friend request");
    }
}

export async function cancelFriendRequest(from_user_id: string, to_user_id: string) {
    try {
        await sql`
        DELETE FROM friend_requests
        WHERE from_user_id = ${from_user_id} AND to_user_id = ${to_user_id};
        `;
    } catch (error) {
        console.error("Error cancelling friend request:", error);
        throw new Error("Failed to cancel friend request");
    }
}

export async function removeFriend(first_friend: string, second_friend: string) {
    try {
        await sql`
        DELETE FROM friends
        WHERE first_friend = ${first_friend} AND second_friend = ${second_friend}
        OR first_friend = ${second_friend} AND second_friend = ${first_friend};
        `;
    } catch (error) {
        console.error("Error removing friend:", error);
        throw new Error("Failed to remove friend");
    }
}

// export async function getMyFriends(user_id: string) {
//     try {
//         const response = await sql`
//         SELECT id, name FROM friends
//         WHERE first_friend = ${user_id}
//         OR second_friend = ${user_id};
//         JOIN users ON (friends.first_friend = users.id OR friends.second_friend =`
//     }
// }

export async function searchFriends(query: string) {
    unstable_noStore();
    try {
        const response = await sql`
        SELECT id, name FROM users
        WHERE name ILIKE ${`%${query}%`} OR email ILIKE ${`%${query}%`};
        `;
        return response.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to search for friends.');
    }
}
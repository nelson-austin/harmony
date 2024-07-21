"use client";

import { redirect, usePathname, useSearchParams, useRouter } from 'next/navigation';

export default function FriendStatus({ userId, id, status  }: { userId: string, id: string, status: string }) {
    
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    function sendFriendRequest() {
        const params = new URLSearchParams(searchParams);
        params.set("action", "send");
        router.push(`${pathname}?${params.toString()}`);
    }

    function removeFriend() {
        const params = new URLSearchParams(searchParams);
        params.set("action", "remove");
        router.push(`${pathname}?${params.toString()}`);
    }

    function acceptFriendRequest() {
        const params = new URLSearchParams(searchParams);
        params.set("action", "accept");
        router.push(`${pathname}?${params.toString()}`);
    }

    function cancelFriendRequest() {
        const params = new URLSearchParams(searchParams);
        params.set("action", "cancel");
        router.push(`${pathname}?${params.toString()}`);
    }

    console.log("status: ", status);
    switch (status) {
        case 'requested':
            return (
                <button onClick={cancelFriendRequest}>Friend Request Sent</button>
            );
        case 'received':
            return (
                <button onClick={acceptFriendRequest}>Accept Friend Request</button>
            );
        case 'friends':
            return (
                <button onClick={removeFriend}>Remove Friend</button>
            );
        default:
            
            
            return (
                <button onClick={sendFriendRequest}>Send Friend Request</button>
            );
    }
}


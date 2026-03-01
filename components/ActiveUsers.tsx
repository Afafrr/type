"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
//shows active users in the channel
export default function ActiveUsers({
  channel,
  userId,
}: {
  channel: ReturnType<typeof supabase.channel> | null;
  userId: string;
}) {
  const [users, setUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!channel || !userId) {
      setUsers(new Set());
      return;
    }

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const nextUsers = new Set<string>();

      Object.values(state).forEach((presences) => {
        (presences as Array<{ user?: string }>).forEach((presence) => {
          if (presence.user) nextUsers.add(presence.user);
        });
      });

      setUsers(nextUsers);
    });

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channel.track({ user: userId });
      }
    });

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [channel, userId]);

  return (
    <>
      <h2 className="font-bold font-black">Online Users: {users.size}</h2>
      <div className="mb-10 w-full p-4 bg-white rounded-lg shadow max-h-40">
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] text-sm text-gray-700 overflow-y-auto">
          {Array.from(users).map((user) => (
            <li key={user} className="">
              {user}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

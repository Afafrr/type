"use client";

import ActiveUsers from "@/components/ActiveUsers";
import { supabase } from "@/lib/supabase";
import { useMemo, useState } from "react";

const ACTIVE_USERS_CHANNEL = "active-users";

export default function Home() {
  const usersChannel = useMemo(() => {
    return supabase.channel("game:1:users");
  }, []);

  return (
    <div>
      <ActiveUsers channel={usersChannel} userId={crypto.randomUUID()} />
    </div>
  );
}

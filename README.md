## Typeracer MVP

Real-time typing race MVP built with Next.js and Supabase.

## Tech stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Supabase (Realtime channels + presence)
- TanStack Table
- ESLint

## How to run

1. Install dependencies

```bash
npm install
```

2. Create a `.env.local` file in the project root and set the Supabase keys:

```bash
# Client-side (public)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISH_KEY=your_supabase_anon_key

# Server-side (secret)
SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_supabase_service_role_key
```

3. Start the dev server

```bash
npm run dev
```

Open http://localhost:3000

## LIVE DEMO

https://type-gg1bnnkwo-mateuszs-projects-01de8684.vercel.app/

## Flow

```
After submitting username user joins the channel
   ↓
Presence is tracked and showed in top of ui
   ↓
When Start is clicked, the request is made to an endpoint,
which broadcasts to every user sentence and time
   ↓
Each client initializes its local round state using the shared timestamps
   ↓
As user types the current sentence is broadcast
   ↓
Each client receives the sentences and calculates on their own
```

## Improvements

For now the priority was to make it playable and working.

- The error handling eg. websockets does not have that.
- Better approach would be to keep websockets live on server and count all the metrics there and update it on client. Supabase Realtime allowed to move quickly and without errors with websockets but it reduces flexibility for custom backend event processing.
- Rounds and final score data could be kept on DB.
- handle already existing player name input
- user could be saved at leat to localStorage
- there is a issue that when user finishes task, WPM stops only locally
- also I had plan to send sentence to server after round finishes so server would calculate based on its time the metrics

Thank you for reading

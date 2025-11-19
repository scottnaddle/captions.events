# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a real-time captioning platform built with Next.js 16, ElevenLabs Scribe, and Supabase. The application allows broadcasters to create live events and transcribe speech in real-time, while viewers can watch captions with optional on-device translation using Chrome's built-in AI.

## Key Technologies

- **Next.js 16** with App Router (React 19)
- **ElevenLabs Scribe API** for real-time speech-to-text transcription
- **Supabase** for authentication, database, and real-time updates
- **GitHub OAuth** for user authentication
- **Tailwind CSS** with Radix UI components
- **TypeScript** throughout

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Architecture

### Database Schema

The application uses two main tables:
- `events`: Stores live caption events with `uid` for public access
- `captions`: Stores real-time captions linked to events via `event_uid`

Both tables have Row Level Security (RLS) policies configured.

### Core Components

- **Broadcaster Interface** (`/broadcast/[uid]`): Real-time transcription using ElevenLabs Scribe
- **Viewer Interface** (`/view/[uid]`): Displays captions with optional translation
- **Event Management**: Create and manage live captioning events via dashboard

### Key Files

- `app/api/scribe-token/route.ts`: Generates ElevenLabs single-use tokens with authentication
- `components/broadcaster-interface.tsx`: Main broadcasting component with real-time transcription
- `components/viewer-interface.tsx`: Viewer component with translation capabilities
- `lib/supabase/client.ts` & `lib/supabase/server.ts`: Supabase client configuration

### Authentication Flow

Uses GitHub OAuth via Supabase Auth. Users must be authenticated to create events and generate transcription tokens.

### Real-time Features

- Uses Supabase Realtime for broadcasting captions to viewers
- ElevenLabs Scribe provides 100-200ms latency transcription
- Chrome Translation API for on-device translation (Chrome 138+)

## Environment Setup

Required environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ELEVENLABS_API_KEY=your_api_key
```

## Database Setup

Run Supabase migrations in order from `supabase/migrations/`:
1. `20251031162352_events.sql` - Events table
2. `20251031162420_captions.sql` - Captions table
3. `20251103000000_add_language_code.sql` - Language support

Use `supabase start` for local development with the CLI.
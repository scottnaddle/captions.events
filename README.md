# LiveCaptions

A real-time captioning platform for live events, conferences, webinars, and presentations. Broadcast live captions to your audience with ultra-low latency using ElevenLabs Scribe and Supabase Realtime.

![LiveCaptions](https://img.shields.io/badge/Status-Production%20Ready-green)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)
![ElevenLabs](https://img.shields.io/badge/ElevenLabs-Scribe-purple)

## ✨ Features

### Core Features

- **🎤 Real-time Transcription**: Ultra-low latency speech-to-text using ElevenLabs Scribe Realtime v2
- **📡 Live Broadcasting**: Real-time caption synchronization to unlimited viewers using Supabase Realtime
- **🌍 On-Device Translation**: Translate captions to 14+ languages using Chrome's built-in Translator API (Chrome 138+)
- **🔍 Auto Language Detection**: Automatic language detection using Chrome's Language Detector API
- **🔐 Secure Authentication**: GitHub OAuth integration via Supabase Auth
- **📊 Event Management**: Create, manage, and organize captioning events
- **📝 Caption History**: Persistent storage of all captions with searchable history
- **🎨 Modern UI**: Beautiful, responsive interface built with Tailwind CSS and shadcn/ui

### Advanced Features

- **Partial Transcripts**: See captions as they're being spoken (100-200ms latency)
- **Final Transcripts**: Polished, complete captions automatically saved
- **Privacy-First Translation**: All translation happens on-device, no external API calls
- **Multilingual Support**: Automatic source language detection and translation
- **Real-time Sync**: Caption updates broadcast instantly to all viewers
- **Caption Export**: (Planned) Export captions to SRT, VTT, and TXT formats

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.x
- **UI Components**: shadcn/ui (Radix UI)
- **Animations**: Framer Motion
- **State Management**: React Hooks

### Backend

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (GitHub OAuth)
- **Real-time**: Supabase Realtime
- **API Routes**: Next.js API Routes

### AI & Speech

- **Speech-to-Text**: ElevenLabs Scribe Realtime v2
- **Translation**: Chrome Translator API (on-device)
- **Language Detection**: Chrome Language Detector API (on-device)

### Infrastructure

- **Package Manager**: pnpm
- **Deployment**: Vercel (recommended)
- **Version Control**: Git

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **pnpm** ([Install](https://pnpm.io/installation))
- **Supabase account** ([Sign up](https://supabase.com))
- **ElevenLabs account** with API access ([Sign up](https://elevenlabs.io/))
- **GitHub account** for OAuth ([Sign up](https://github.com))
- **Google Chrome 138+** (for translation features)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/v0_realtime_scribe.git
cd v0_realtime_scribe
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Supabase

#### Option A: Use Supabase Cloud (Recommended for Production)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Go to **Settings → API** and copy:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - `anon` public key
4. Go to **Database → Migrations** and run the migrations:
   - Upload files from `supabase/migrations/` in order:
     - `20251031162352_events.sql`
     - `20251031162420_captions.sql`
     - `20251103000000_add_language_code.sql`

#### Option B: Use Supabase CLI (Recommended for Development)

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase instance
supabase start

# The CLI will output your local credentials
# Note: Keep this terminal window open
```

### 4. Configure GitHub OAuth

Follow the detailed guide: [GITHUB_AUTH_SETUP.md](./GITHUB_AUTH_SETUP.md)

**Quick steps:**

1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Create a new OAuth App with:
   - **Homepage URL**: `http://localhost:3000`
   - **Callback URL**: `http://localhost:3000/auth/callback`
3. Copy the **Client ID** and **Client Secret**
4. In Supabase Dashboard, go to **Authentication → Providers → GitHub**
5. Enable GitHub and paste your credentials

### 5. Get ElevenLabs API Key

1. Sign in to [ElevenLabs](https://elevenlabs.io/)
2. Go to your profile settings
3. Copy your API key
4. Keep it secure (never commit to version control)

### 6. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp example.env.local .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Site URLs (adjust for production)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ElevenLabs API Key (server-side only - NEVER expose to client)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### 7. Run Database Migrations

If using Supabase CLI locally:

```bash
supabase db reset
```

If using Supabase Cloud, the migrations should already be applied in step 3.

### 8. Start the Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### For Broadcasters

#### Creating an Event

1. Sign in at [http://localhost:3000/auth/signin](http://localhost:3000/auth/signin)
2. Go to **Dashboard** → **Create Event**
3. Fill in event details:
   - **Title**: Name of your event
   - **Description**: Brief description for viewers
4. Click **Create Event**

#### Broadcasting Captions

1. Navigate to your event's broadcast page: `/broadcast/[uid]`
2. Click **"Start Recording"** to begin transcription
3. Grant microphone permissions when prompted
4. Speak into your microphone
5. **Partial transcripts** (italic, light background) appear as you speak
6. **Final transcripts** (solid background) are saved when you pause
7. The detected language badge shows the current language
8. Click **"Stop Recording"** to end the session

**Tips:**

- Use a good quality microphone for best results
- Speak clearly and at a moderate pace
- Minimize background noise
- Chrome will automatically detect the language you're speaking

### For Viewers

1. Navigate to the viewer page: `/view/[uid]` (get link from broadcaster)
2. The latest caption appears prominently at the top
3. Caption history is shown below in chronological order
4. Captions update automatically in real-time

#### Using Translation (Chrome 138+ Required)

1. Click the **language dropdown** at the top
2. Select your preferred language
3. On first use, Chrome will download the translation model (progress shown)
4. All captions (including live ones) will be translated automatically
5. Select **"Original (No Translation)"** to view captions in their original language

**Supported Translation Languages:**

- English, Spanish, French, German, Italian, Portuguese
- Dutch, Russian, Japanese, Korean, Chinese (Simplified)
- Arabic, Hindi, Turkish

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────────┐
│   Broadcaster   │
│   Interface     │
└────────┬────────┘
         │
         │ Audio Stream
         ▼
┌─────────────────────┐
│  ElevenLabs Scribe  │
│   Realtime v2       │
└────────┬────────────┘
         │
         │ Transcripts + Language Code
         ▼
┌─────────────────────┐
│ Chrome Language     │
│ Detector API        │◄─── (Optional) Confidence-based detection
└────────┬────────────┘
         │
         │ Detected Language
         ▼
┌─────────────────────┐
│   Supabase DB       │
│   + Realtime        │
└────────┬────────────┘
         │
         │ Real-time Updates
         ▼
┌─────────────────────┐
│   Viewer            │
│   Interface         │
└────────┬────────────┘
         │
         │ (Optional)
         ▼
┌─────────────────────┐
│ Chrome Translator   │
│ API (On-Device)     │
└─────────────────────┘
```

### Key Components

#### Authentication Flow

```typescript
// app/auth/signin/page.tsx
// app/auth/signup/page.tsx
// app/auth/callback/route.ts
```

- GitHub OAuth integration via Supabase Auth
- Secure callback handling
- Session management

#### Event Management

```typescript
// app/dashboard/page.tsx - List user's events
// app/dashboard/create/page.tsx - Create new events
// components/create-event-form.tsx - Event creation form
// components/events-list.tsx - Event list display
```

#### Broadcaster Interface

```typescript
// app/broadcast/[uid]/page.tsx
// components/broadcaster-interface.tsx
```

- Microphone access and audio streaming
- ElevenLabs Scribe integration
- Real-time language detection
- Caption broadcasting via Supabase Realtime
- Live preview of viewer experience

#### Viewer Interface

```typescript
// app/view/[uid]/page.tsx
// components/viewer-interface.tsx
```

- Real-time caption display
- Supabase Realtime subscription
- On-device translation (Chrome 138+)
- Caption history with smooth scrolling

#### API Routes

```typescript
// app/api/scribe-token/route.ts
```

- Secure token generation for ElevenLabs Scribe
- Authentication and authorization checks
- Single-use token creation (15-minute expiry)

#### Database Schema

```sql
-- Events table
events (
  id UUID PRIMARY KEY,
  uid TEXT UNIQUE,
  title TEXT,
  description TEXT,
  creator_id UUID,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Captions table
captions (
  id UUID PRIMARY KEY,
  event_id UUID,
  text TEXT,
  sequence_number INTEGER,
  is_final BOOLEAN,
  language_code TEXT,
  created_at TIMESTAMP
)
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Configure environment variables:
   - Add all variables from `.env.local`
   - Update `NEXT_PUBLIC_SITE_URL` to your production domain
4. Click **Deploy**
5. Update GitHub OAuth callback URL to `https://yourdomain.com/auth/callback`
6. Update Supabase Auth settings with production URLs

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:

- **Netlify**: Use the Next.js plugin
- **Railway**: Connect your GitHub repo
- **AWS Amplify**: Deploy as a Next.js SSR app
- **Self-hosted**: Build with `pnpm build` and run with `pnpm start`

### Environment Variables for Production

Ensure these are set in your production environment:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
ELEVENLABS_API_KEY=your_production_api_key
```

## 🔧 Troubleshooting

### Token Generation Fails

**Problem**: "Failed to generate token" error

**Solutions:**

- Verify `ELEVENLABS_API_KEY` is set in `.env.local`
- Ensure you're authenticated (sign in)
- Verify you own the event
- Check server logs for detailed errors
- Confirm your ElevenLabs account has API access

### Microphone Not Working

**Problem**: No audio is captured

**Solutions:**

- Grant microphone permissions in browser
- Ensure you're using HTTPS (required for microphone access)
- Check browser security settings
- Try a different browser or device
- Verify microphone is not in use by another application

### Captions Not Appearing

**Problem**: Transcripts not showing up

**Solutions:**

- Verify Supabase connection is working
- Check that realtime subscriptions are enabled
- Open browser console for error messages
- Ensure Row Level Security policies are correct
- Test database connection in Supabase dashboard

### Translation Not Working

**Problem**: Translation option not available

**Solutions:**

- Ensure you're using **Google Chrome 138+**
- Check Chrome version: Settings → About Chrome
- Enable built-in AI features in `chrome://flags`
- Look for "Prompt API for Gemini Nano" flag
- Clear cache and restart browser
- On first use, wait for model download to complete

### Language Detection Not Working

**Problem**: Language badge not appearing

**Solutions:**

- Update to Chrome 138 or higher
- Check console for API support: `'LanguageDetector' in window`
- Speak longer sentences (>10 characters)
- Ensure audio quality is good
- Falls back to ElevenLabs language detection automatically

### Database Connection Issues

**Problem**: "Failed to connect to database"

**Solutions:**

- Verify Supabase credentials in `.env.local`
- Check Supabase project is running (not paused)
- Ensure database migrations are applied
- Check Row Level Security policies
- Verify network connectivity

## 📚 Additional Documentation

- **[SCRIBE_SETUP.md](./SCRIBE_SETUP.md)** - Detailed ElevenLabs Scribe configuration
- **[GITHUB_AUTH_SETUP.md](./GITHUB_AUTH_SETUP.md)** - GitHub OAuth setup guide
- **[TRANSLATION_FEATURE.md](./TRANSLATION_FEATURE.md)** - Translation implementation details
- **[CHROME_LANGUAGE_DETECTOR.md](./CHROME_LANGUAGE_DETECTOR.md)** - Language detection guide
- **[LANGUAGE_CODE_UPDATE.md](./LANGUAGE_CODE_UPDATE.md)** - Language code handling

## 🔒 Security Considerations

1. **API Key Protection**: ElevenLabs API key is NEVER exposed to the client
2. **Single-use Tokens**: Scribe tokens expire after 15 minutes
3. **Authentication**: Only authenticated users can create events and broadcast
4. **Authorization**: Only event owners can broadcast to their events
5. **Row Level Security**: Supabase RLS controls data access
6. **On-Device AI**: Translation and language detection happen locally
7. **HTTPS Required**: Microphone access requires secure context

## 🎯 Performance

- **Transcription Latency**: 100-200ms for partial transcripts
- **Real-time Sync**: <100ms broadcast delay to viewers
- **Translation Speed**: <100ms on-device translation
- **Language Detection**: 10-50ms per detection
- **Database Queries**: Optimized with indexes
- **Realtime Scaling**: Handles thousands of concurrent viewers

## 🛣️ Roadmap

### Planned Features

- [ ] Caption export (SRT, VTT, TXT formats)
- [ ] Custom caption styling
- [ ] Speaker identification
- [ ] Caption editing and corrections
- [ ] Event analytics and statistics
- [ ] Mobile apps (iOS/Android)
- [ ] Keyboard shortcuts
- [ ] Caption search and filtering
- [ ] Multi-event support
- [ ] Recording playback

### Completed Features

- [x] Real-time transcription
- [x] On-device translation
- [x] Automatic language detection
- [x] GitHub OAuth authentication
- [x] Event management
- [x] Caption history
- [x] Viewer interface
- [x] Broadcaster interface

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **[ElevenLabs](https://elevenlabs.io/)** - For the amazing Scribe Realtime API
- **[Supabase](https://supabase.com/)** - For real-time infrastructure and authentication
- **[Chrome Team](https://developer.chrome.com/)** - For built-in AI APIs
- **[shadcn/ui](https://ui.shadcn.com/)** - For beautiful UI components
- **[Vercel](https://vercel.com/)** - For Next.js and hosting

## 📞 Support

For issues and questions:

- **ElevenLabs API**: [ElevenLabs Support](https://elevenlabs.io/support)
- **Supabase**: [Supabase Documentation](https://supabase.com/docs)
- **Chrome AI APIs**: [Chrome AI Documentation](https://developer.chrome.com/docs/ai/built-in)
- **Project Issues**: [GitHub Issues](https://github.com/yourusername/v0_realtime_scribe/issues)

## 🔗 Resources

### Official Documentation

- [ElevenLabs Scribe Documentation](https://elevenlabs.io/docs/api-reference/scribe)
- [ElevenLabs React SDK](https://www.npmjs.com/package/@elevenlabs/react)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Next.js Documentation](https://nextjs.org/docs)
- [Chrome Translator API](https://developer.chrome.com/docs/ai/translator-api)
- [Chrome Language Detector](https://developer.chrome.com/docs/ai/language-detection)

### Tutorials & Guides

- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [GitHub OAuth Setup](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Built with ❤️ using ElevenLabs Scribe, Supabase, and Next.js**

_Star this repo if you find it helpful!_ ⭐

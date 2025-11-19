# Translation Features

This document explains the enhanced translation capabilities that have been added to the LiveCaptions platform.

## Overview

The viewer interface now supports real-time translation with multiple translation services and display modes:

1. **Multiple Translation Services**: Chrome AI Translator and Google Gemini
2. **Side-by-Side View**: Original content and translation displayed simultaneously
3. **Auto-Scrolling**: Automatically scrolls to show the latest content
4. **Enhanced Language Support**: Support for 50+ languages including Korean and English

## Setup

### Chrome AI Translation

Chrome AI translation works out-of-the-box in supported browsers:
- **Requirement**: Chrome 138+ with built-in AI features enabled
- **Advantage**: On-device processing, complete privacy, no additional cost
- **Language Support**: 15 major languages

### Gemini Translation Setup

To enable Gemini translation:

1. **Get Gemini API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key

2. **Add Environment Variable**:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Restart the Development Server**:
   ```bash
   pnpm dev
   ```

## Features

### Translation Services

1. **None**: Display original captions only
2. **Chrome AI**: Use Chrome's built-in translator (client-side)
3. **Gemini**: Use Google Gemini API (server-side)

### Display Modes

1. **Translated Only**: Shows only the translated captions
2. **Side by Side**: Shows original and translated captions simultaneously

### Supported Languages

The platform supports 50+ languages including:
- **Korean** (ko)
- **English** (en)
- **Spanish** (es)
- **French** (fr)
- **German** (de)
- **Italian** (it)
- **Portuguese** (pt)
- **Russian** (ru)
- **Japanese** (ja)
- **Chinese** (zh)
- **Arabic** (ar)
- **Hindi** (hi)
- And many more...

## Usage

1. **Open Viewer Interface**: Navigate to `/view/[event-uid]`

2. **Select Translation Service**:
   - Choose from "None", "Chrome AI", or "Gemini"
   - The interface will show available options based on your browser and API configuration

3. **Choose Target Language**:
   - Select your preferred translation language
   - The system will automatically detect the source language

4. **Select Display Mode**:
   - "Translated Only": See just the translated captions
   - "Side by Side": See both original and translated captions simultaneously

5. **Real-time Translation**:
   - Captions are translated as they arrive
   - Partial text is translated with debouncing (500ms delay)
   - Translation status is shown with loading indicators

## Auto-Scrolling

The caption display automatically scrolls to show the latest content:
- Scrolls when new captions arrive
- Scrolls when partial text updates
- Works in both single and side-by-side view modes
- Maintains scroll position during translation updates

## Technical Implementation

### Client-side Chrome Translation
- Uses Chrome's Translator API
- On-device processing for privacy
- Automatic language detection
- Model download progress indication

### Server-side Gemini Translation
- Uses Gemini 1.5 Flash model
- Supports 50+ languages
- Context-aware translation
- Fast response times

### Real-time Updates
- WebSocket connection via Supabase Realtime
- Debounced translation for partial text
- Concurrent translation processing
- Error handling and fallbacks

## Troubleshooting

### Chrome Translation Not Available
- **Solution**: Use Chrome 138+ with AI features enabled, or switch to Gemini

### Gemini Translation Not Working
- **Check**: Verify GEMINI_API_KEY environment variable is set
- **Check**: Ensure API key has sufficient quota
- **Solution**: Regenerate API key if needed

### Translation Errors
- **Chrome**: Network connectivity or model download issues
- **Gemini**: API rate limits or service availability
- **Solution**: Switch translation service or retry later

### Performance Issues
- **Chrome**: Initial model download may take time
- **Gemini**: Network latency for API calls
- **Solution**: Use local Chrome translation for better performance

## Privacy and Security

- **Chrome Translation**: All processing happens locally on your device
- **Gemini Translation**: Text is sent to Google's servers for processing
- **Data Storage**: Original captions are stored in Supabase, translations are not stored

## Cost Considerations

- **Chrome Translation**: Free, included with Chrome browser
- **Gemini Translation**: Pay-per-use based on API usage
- **Recommendation**: Use Chrome translation when available for cost efficiency
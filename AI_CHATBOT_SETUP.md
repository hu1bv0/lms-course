# AI Chatbot Setup Guide

## Environment Variables Required

Create a `.env` file in your project root with these variables:

```bash
# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_AI_MODEL=gemini-1.5-flash

# Firebase Configuration (if not already set)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration (if not already set)
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_CLOUDINARY_UPLOAD_URL=https://api.cloudinary.com/v1_1/your_cloud_name/image/upload
```

## How to Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key and paste it in your `.env` file

## AI Models Available

- `gemini-2.5-flash` (always used, latest hybrid reasoning model)

**Note**: The app always uses `gemini-2.5-flash` model with 1M token context window and thinking budgets.

## Testing the Chatbot

1. Make sure your `.env` file has the correct `VITE_GEMINI_API_KEY`
2. Start your development server: `npm run dev`
3. Navigate to the chatbot page
4. Type a question and press Enter
5. Check the browser console for debug logs

## Troubleshooting

### Gemini API 404 Error
- The app always uses `gemini-2.5-flash` model (latest hybrid reasoning model)
- If you get 404, check the console for "Available models" to see what's supported in your region
- Make sure your API key is valid and has access to Gemini 2.5 models

### Precondition Failed Error
- This is normal for first-time users
- The app will automatically initialize the Firestore collections
- Check console logs for initialization status

### No Response from AI
- Check your internet connection
- Verify the API key is correct
- Check browser console for error messages

# Retell AI Pronunciation Feedback Setup Guide

## Issue Fixed ✅
The 500 error was caused by missing Retell AI error definitions in the backend. This has been resolved.

## Current Status
The pronunciation feedback button requires a Retell AI API key to function. Without it, you'll see a 500 error.

## Option 1: Get Retell AI API Key (Recommended for Production)

### Steps:
1. **Sign up for Retell AI**
   - Visit: https://app.retellai.com/
   - Create an account

2. **Get your API Key**
   - Go to: https://app.retellai.com/dashboard
   - Navigate to API Keys section
   - Copy your API key

3. **Create an Agent**
   - In Retell dashboard, create a new agent for pronunciation feedback
   - Configure it for language learning/pronunciation practice
   - Copy the Agent ID

4. **Configure Backend (.env)**
   Add to `Fluentify-Backend/.env`:
   ```env
   RETELL_API_KEY=your_actual_retell_api_key_here
   ```

5. **Configure Frontend (.env)**
   Create/update `Fluentify-Frontend/.env`:
   ```env
   VITE_RETELL_AGENT_ID=your_actual_agent_id_here
   VITE_API_URL=http://localhost:5000
   ```

6. **Restart both servers**
   ```bash
   # Backend
   cd Fluentify-Backend
   npm run dev

   # Frontend
   cd Fluentify-Frontend
   npm run dev
   ```

## Option 2: Disable Feature Temporarily

If you don't want to use Retell AI right now, you can:

### Hide the pronunciation feedback button in the UI
The button is likely in a component that calls `VoiceAiModal`. You can comment it out or add a feature flag.

### Add graceful error handling
The backend already handles missing API keys, but you can improve the frontend error message.

## What Was Fixed

### Backend Changes:
1. ✅ Added missing Retell AI error definitions in `src/utils/error.js`:
   - `RETELL_AGENT_ID_REQUIRED`
   - `RETELL_API_NOT_CONFIGURED`
   - `RETELL_AUTHENTICATION_FAILED`
   - `RETELL_RATE_LIMIT`
   - `RETELL_INVALID_AGENT`
   - `RETELL_CALL_CREATION_FAILED`
   - `RETELL_API_ERROR`

2. ✅ Created `env.example` file with required configuration

### How It Works:
1. User clicks pronunciation feedback button
2. Frontend (`VoiceAiModal.jsx`) calls `createRetellCall(agentId)`
3. Backend (`retellController.js`) checks for `RETELL_API_KEY`
4. If missing → Returns error 80002: "Retell AI service is not configured"
5. If present → Creates call session and returns access token
6. Frontend uses access token to start voice conversation

## Testing After Setup

1. Make sure both `.env` files are configured
2. Restart both servers
3. Log in to your app
4. Click the pronunciation feedback button
5. You should see "Connecting to AI tutor..." then "Connected - Start speaking!"

## Troubleshooting

### Still getting 500 error?
- Check backend console for specific error message
- Verify `RETELL_API_KEY` is in backend `.env`
- Verify `VITE_RETELL_AGENT_ID` is in frontend `.env`
- Restart both servers after adding env variables

### Getting authentication error?
- Verify your Retell API key is correct
- Check if your Retell account is active

### Getting invalid agent error?
- Verify the Agent ID matches an agent in your Retell dashboard
- Make sure the agent is configured and active

## Need Help?
- Retell AI Docs: https://docs.retellai.com/
- Retell AI Dashboard: https://app.retellai.com/dashboard

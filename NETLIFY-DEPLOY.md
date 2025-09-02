# Deploying to Netlify

This document provides instructions for deploying the Notes App to Netlify.

## Prerequisites

Before deploying, ensure you have:

1. A Netlify account
2. The project code pushed to a GitHub repository
3. All required environment variables ready

## Environment Variables Setup

The following environment variables need to be set in Netlify's dashboard:

```
VITE_API_KEY=your_firebase_api_key
VITE_APP_ID=your_firebase_app_id
VITE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_MEASURMENT_ID=your_firebase_measurement_id
VITE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_PROJECT_ID=your_firebase_project_id
VITE_SERVICE_ID=your_emailjs_service_id
VITE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_TEMPLATE_ID=your_emailjs_template_id
VITE_URL=your_backend_api_url
VITE_USER_ID=your_emailjs_user_id
```

## Deployment Steps

1. **Link your GitHub repository to Netlify:**
   - Log in to Netlify
   - Click "New site from Git"
   - Select GitHub and authenticate
   - Choose your repository

2. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: `frontend`

3. **Add environment variables:**
   - Go to Site settings > Build & deploy > Environment
   - Add all the required environment variables listed above

4. **Advanced build settings:**
   - Set `SECRETS_SCAN_ENABLED` to `false` to disable secrets scanning
   - Or use `SECRETS_SCAN_OMIT_PATHS` with value `dist/*` to ignore build output

5. **Deploy your site:**
   - Click "Deploy site"

## Troubleshooting

### Secrets Scanning Issues

If you encounter build failures due to secrets scanning, you can:

1. Use the `netlify.toml` configuration provided in this repository
2. Set the environment variable `SECRETS_SCAN_ENABLED` to `false` in Netlify dashboard
3. Add `SECRETS_SCAN_OMIT_PATHS` with value `dist/*` in Netlify dashboard

### Frontend Routing Issues

For proper SPA routing, ensure the `netlify.toml` file includes the following redirects configuration:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This ensures that all routes are handled by the React Router instead of Netlify's server.

## Continuous Deployment

Once set up, Netlify will automatically deploy new versions whenever you push changes to your repository's main branch.

## Backend API Configuration

Remember to update the `VITE_URL` environment variable to point to your deployed backend API.

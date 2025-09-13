# RecipeSnap

RecipeSnap is a Next.js application that allows users to browse and manage recipes. This README provides an overview of the project, setup instructions, and usage guidelines.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Deployment](#deployment)
- [License](#license)

## Features

- Browse a collection of recipes.
- View detailed information about each recipe.
- Firebase integration for hosting and Firestore database.

## Technologies

- Next.js
- React
- Firebase (Firestore, Hosting)
- TypeScript
- CSS

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd RecipeSnap
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Firebase:**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Add a web app to your Firebase project.
   - Copy the Firebase configuration and add it to the `.env.local` file in the root of the project:

     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```

## Usage

To run the application locally, use the following command:

```bash
npm run dev
```

This will start the development server at `http://localhost:3000`.

## Deployment

To deploy the application to Firebase Hosting, run:

```bash
firebase deploy
```

Ensure you have the Firebase CLI installed and are authenticated with your Firebase account.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
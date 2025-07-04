# Todo App Frontend

A modern, serverless todo application built with Next.js, AWS Amplify, and AWS AppSync.

## Features

- **Authentication**: Complete auth flow with AWS Cognito
  - Sign up with email verification
  - Sign in/out
  - Forgot password
  - Change password
  - Profile management
- **Todo Management**: Full CRUD operations
  - Create new todos
  - Mark todos as complete/incomplete
  - Delete todos
  - Filter by status (all/active/completed)
- **Real-time Updates**: GraphQL subscriptions for multi-device sync
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Type Safety**: Full TypeScript support

## Prerequisites

1. Deploy the backend first:
   ```bash
   cd ../backend
   npm install
   npm run deploy
   ```

2. Ensure the CDK deployment completed successfully and generated `cdk-outputs.json`

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables from CDK outputs:
   ```bash
   npm run setup-env
   ```
   This will create a `.env.local` file with your AWS resources.

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── profile/           # User profile page
│   └── page.tsx           # Home page (todo list)
├── components/            # React components
│   ├── auth-*.tsx        # Auth-related components
│   ├── todo-*.tsx        # Todo-related components
│   └── *.tsx             # Shared components
├── lib/                   # Utilities and configs
│   ├── amplify-*.ts      # AWS Amplify configuration
│   └── graphql-*.ts      # GraphQL operations
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript types
└── scripts/              # Build and setup scripts
```

## Environment Variables

The following environment variables are required (automatically set by `npm run setup-env`):

- `NEXT_PUBLIC_USER_POOL_ID`: AWS Cognito User Pool ID
- `NEXT_PUBLIC_USER_POOL_CLIENT_ID`: Cognito App Client ID
- `NEXT_PUBLIC_GRAPHQL_ENDPOINT`: AWS AppSync GraphQL endpoint
- `NEXT_PUBLIC_AWS_REGION`: AWS region

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint
- `npm run setup-env`: Set up environment from CDK outputs

## Authentication Flow

1. New users sign up with email and password
2. Verify email with confirmation code
3. Sign in to access todo list
4. Manage profile and change password from profile page

## Deployment

To deploy to production:

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy using your preferred hosting service (Vercel, Amplify Hosting, etc.)

## Troubleshooting

- **Environment variables not found**: Run `npm run setup-env` after deploying backend
- **Authentication errors**: Check Cognito User Pool settings in AWS Console
- **API errors**: Verify AppSync endpoint and authentication mode
- **Build errors**: Ensure all dependencies are installed with `npm install`
# CC-Plan-B Next.js Application

This is a fully migrated Next.js 15 application converted from the original React application. The application now uses Next.js App Router with all the modern features.

## Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Mantine UI** for component library
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Server-Side Rendering (SSR)**
- **Static Site Generation (SSG)**
- **API Routes** support

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd stemlen-nextjs
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Migration Changes

### Key Changes from React to Next.js

1. **Routing**: Migrated from React Router to Next.js App Router
2. **File Structure**: Moved from `src/Component` to `src/app` and `src/components`
3. **SSR Support**: Added server-side rendering capabilities
4. **Import Paths**: Updated all imports to use Next.js conventions
5. **Client Components**: Added 'use client' directive where needed

### Directory Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── find-jobs/       # Job search page
│   ├── jobs/[id]/       # Dynamic job details
│   ├── apply-job/[id]/  # Job application
│   ├── profile/         # User profile
│   └── ...              # Other routes
├── components/          # Reusable components
│   ├── Header/         
│   ├── Footer/         
│   ├── Pages/          
│   └── ...             
├── Services/           # API services and utilities
├── Slices/            # Redux slices
├── assets/            # Static assets
└── Interceptor/       # API interceptors
```

## Features

### Authentication
- JWT-based authentication
- Protected routes for authenticated users
- Role-based access control (USER, COMPANY)

### Job Management
- Job posting and searching
- Company profiles
- Talent profiles
- Application management

### UI/UX
- Responsive design with Tailwind CSS
- Mantine UI components
- Dark mode support
- Mobile-friendly interface

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_OAUTH_CLIENT_ID=your_oauth_client_id
# Add other environment variables as needed
```

## Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Deploy to Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically build and deploy your app

## Technologies Used

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Mantine** - Component library
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **JWT** - Authentication
- **React Helmet** - Document head management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

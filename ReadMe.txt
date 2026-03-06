1. Initialize the project
    npm init -y

Then install dependencies:
    npm install express dotenv npm install -D typescript ts-node @types/node @types/express nodemon eslint prettier
        
        The DotEnv package is used to read environment variables from a .env file.

        The -D, or --dev, flag directs the package manager to install these libraries as development dependencies.

        ts-node         — Enables running TypeScript files directly without pre-compiling to JavaScript
        @types/node     — Provides TypeScript type definitions for Node.js core modules
        @types/express  — Adds TypeScript type definitions for the Express framework
        nodemon         — Automatically restarts the server when file changes are detected during development
        eslint          — Lints the code to catch errors and enforce coding standards
        prettier        — Formats the code to ensure consistent style across the project

2. Configure TypeScript
    npx tsc --init

    Once you execute this command, you’ll notice the tsconfig.json file is created at the root of your project directory. This file contains the default compiler options, as depicted in the image below:

    {
    "compilerOptions": {
        "target": "ES2020",
        "module": "commonjs",
        "outDir": "./dist",
        "rootDir": "./src",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules"]
    }

    Develop this project structure:
    
    ts-node-express/
    ├── src/
    │   ├── config/
    │   │   └── config.ts        // Load and type environment variables
    │   ├── controllers/
    │   │   └── itemController.ts  // CRUD logic for "items"
    │   ├── middlewares/
    │   │   └── errorHandler.ts    // Global typed error handling middleware
    │   ├── models/
    │   │   └── item.ts          // Define item type and in-memory storage
    │   ├── routes/
    │   │   └── itemRoutes.ts    // Express routes for items
    │   ├── app.ts               // Express app configuration (middlewares, routes)
    │   └── server.ts            // Start the server
    ├── .env                     // Environment variables
    ├── package.json             // Project scripts, dependencies, etc.
    ├── tsconfig.json            // TypeScript configuration
    ├── .eslintrc.js             // ESLint configuration
    └── .prettierrc              // Prettier configuration


npm install prisma @prisma/client bcrypt jsonwebtoken
npm install -D @types/bcrypt @types/jsonwebtoken
npx prisma init
npx prisma migrate dev --name init
npx prisma generate




1.create Users
2.add middle ware to token authenticate
3. login log out functions

Relation 1: Caregiver owns profile
User (CAREGIVER role)
    ↓ (1:1)
Caregiver profile

Relation 2: Admin approves caregivers
User (ADMIN role)
    ↓ (1:Many)
Caregivers approved by that admin


npx prisma migrate dev --name Caregiver_model

npx prisma migrate dev --name Caretaker_model_and_Elder_model

npx prisma migrate reset

npx prisma migrate dev --name Caretaker_model_Attribute_name_change


npx prisma migrate dev --name Elder_model_BloodGroup_Attribute_change

npx prisma migrate dev --name Elder_model_caretakerId_make_as_unique

npx prisma migrate dev --name CareGiver_status_changes


npx prisma migrate dev --name CareGiver_Versions_table_v2

npx prisma migrate dev --name CareGiver_Versions_table_v3


npx prisma migrate dev --name Caregiver_Document_Version
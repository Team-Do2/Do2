# Getting Started

This file will outline the project setup process for new developers working on this project.

## Before you Start

You should have the following installed:

- [Visual Studio]<https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&channel=Release&version=VS2022&source=VSLandingPage&cid=2030&passive=false> with "ASP.NET and Web Development" and the ".NET 9.0 Runtime"
- [Node.js]<https://nodejs.org/dist/v22.20.0/node-v22.20.0-x64.msi>
- A code editor of your choice (I recommend vscode)

## How it Works

This project is made up of 3 main parts: frontend, backend, and database.

- Frontend: The frontend uses the [React]<https://react.dev/learn> framework. All frontend code can be found in `./UI`. React files have the extension `.tsx`, and the framework relies heavily on components. When we are finished developing our project, we will build it, and serve it with ASP.NET.
- Backend: The backend uses [ASP.NET]<https://learn.microsoft.com/en-us/training/modules/build-web-api-aspnet-core/>. These files are in the root of this repository. This will also act as our development server, as it serves any files placed in `./wwwroot`.
- Database: The database is a MySQL server that is hosted remotely. The backend will access it to get data.

## Development

1. Run `dotnet watch run` in the root directory. This will start the backend and bring up all API endpoints at `localhost:5015`.
2. Start a new command line and run `npm run dev` in the `./UI` directory. This will start a the frontend with a development webserver at `localhost:5173`.
3. You can now make changes to the frontend or backend, and they will be automatically reloaded as long as both scrips are running.

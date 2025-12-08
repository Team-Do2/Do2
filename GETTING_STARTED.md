# Getting Started

This file will outline the project setup process for new developers working on this project. Development support is possible on any operating system that can run Microsoft .NET 9.0 SDK and Node.js. (windows, linux, and mac supported)

## Before you Start

Check out the fully deployed app at https://do2.chenevertsoftwareservices.com/ to get a good overview of all the features and general sense of our basic and advanced database functionality!

You should have the following installed:

- [Visual Studio](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&channel=Release&version=VS2022&source=VSLandingPage&cid=2030&passive=false) with "ASP.NET and Web Development" and the ".NET 9.0 Runtime"
- [Node.js](https://nodejs.org/dist/v22.20.0/node-v22.20.0-x64.msi)
- .NET 9.0 SDK
- MySQL

## How it Works

This project is made up of 3 main parts: frontend, backend, and database.

- Frontend: The frontend uses the [React](https://react.dev/learn) framework. All frontend code can be found in `./UI`. React files have the extension `.tsx`, and the framework relies heavily on components. When we are finished developing our project, we will build it, and serve it with ASP.NET.
- Backend: The backend uses [ASP.NET](https://learn.microsoft.com/en-us/training/modules/build-web-api-aspnet-core/). These files are in the root of this repository. This will also act as our development server, as it serves any files placed in `./wwwroot`.
- Database: The database is a MySQL server that is hosted remotely. The backend will access it to get data. To set up your own databse to match the one used in produciton, execute the database creation script `init_databse.sql`.
  (Note: the connection string used to reach MySQL will need to be configured in `appsettings.Development.json`)

## Development

1. Run `dotnet watch run` in the root directory. This will start the backend and bring up all API endpoints at `localhost:5015`.
2. Start a new command line and run `npm run dev` in the `./UI` directory. This will start a the frontend with a development webserver at `localhost:5173`.
   (Note: before you run the UI the first time, you will need to run `npm install` to get all dependencies)
3. You can now make changes to the frontend or backend, and they will be automatically reloaded as long as both scrips are running.
4. Once you are done, you can run .\Tools\PublishProject.ps1 username webserver-ip to publish your changes

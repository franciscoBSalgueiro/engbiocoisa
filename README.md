# Winter Hackaton - Os engenheiros e a Biocoisa

## **MasterMomentum**



TThe app allows users to search for universities and see reviews from other students about their experiences. Users can also search for majors within each university and see reviews about the specific major.
Usefull for High School students ready to beggin their University Life and for university students that want to ingress in a Masters degree or on optional classes.


# Running our project

This is a guide on how to run a project that uses Prisma and Next.js with pnpm. 

## Prerequisites

Before running the project, you must have the following software installed:

- Node.js (version 14 or later)
- pnpm (version 6 or later)
- Prisma CLI (version 2 or later)

## Installation

To install the project, follow these steps:

1. Clone the repository from GitHub: `git clone https://github.com/franciscoBSalgueiro/engbiocoisa`
2. Navigate to the project directory: `cd engbiocoisa/website`
3. Install the dependencies using pnpm: `pnpm install`
4. Generate the Prisma client: `npx prisma generate`
5. Initializae the database: `npx prisma db push`

## Running the Project

To run the project, follow these steps:

1. Start the development server: `pnpm dev`
2. Open your web browser and navigate to `http://localhost:3000`

## Building for Production

To build the project for production, follow these steps:

1. Build the Next.js app: `pnpm build`
2. Start the production server: `pnpm start`
3. Open your web browser and navigate to `http://localhost:3000`

## Conclusion

That's it! You now know how to install, run, and build a project that uses Prisma and Next.js with pnpm. Happy coding!



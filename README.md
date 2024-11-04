# Campus Food Delivery App

A food delivery application designed for campus students, allowing them to order food from local restaurants and businesses. This application uses a modern tech stack to provide a seamless user experience.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Migration](#database-migration)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and authentication
- Food ordering from local restaurants
- User profiles and order history
- Admin panel for managing orders and restaurants
- JWT-based authentication for secure API access
- Responsive design for mobile and desktop users

## Technologies

- **Frontend**: React.js, CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: JSON Web Tokens (JWT)
- **Environment Variables**: dotenv
- **Others**: cors, nodemon

## Installation

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js (v16 or later)
- PostgreSQL
- npm or yarn

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/campus-food-delivery-app.git
   cd campus-food-delivery-app

2. **Install dependencies**
   ```bash
   npm install
   or
   yarn install

3. **Configure environment variables**
   Create a .env file in the root directory and add the following variables:
   ```bash
   PORT=3000
   DATABASE_URL="postgresql://your_username:your_password@localhost:5432/your_database_name"
   JWT_SECRET=your_jwt_secret
   ```

   Replace the values with your actual database credentials and a secret key for JWT.

4. **Create the postgres database**
   ```bash
   psql -U your_username -c "CREATE DATABASE your_database_name;"
   ```
   --ensure you have postgresql installed and running

5. **Run the database migration**
   ```bash
   npx drizzle-kit migrate
   ```
   This will create the necessary tables in the database.
6. **Run the application**
    ```bash
    npm start #for production
    or
    yarn start
    npm run dev #for developement

    The application will be accessible at http://localhost:3000.

    ## API Endpoints
    The API endpoints are documented in the API documentation.
    ## Database Migration
    The database migration is managed using Drizzle ORM. To create a new migration, run:
    ```bash
    npx drizzle-kit generate:migration create_users_table
    ```
    This will create a new migration file in the migrations directory.
    ## Authentication
    The application uses JWT for authentication. The JWT secret is stored in the .env file.
    ## Contributing
    Contributions are welcome! Please open an issue or submit a pull request.
    Please follow these steps:
    1. Fork the repository
    2. Create a new branch: git checkout -b feature/your-feature
    3. Commit your changes: git commit -m 'Add new feature'
    4. Push to the branch: git push origin feature/YourFeature
    5. Open a pull request
    ## License
    This project is under MIT license.

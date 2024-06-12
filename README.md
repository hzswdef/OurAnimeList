### OurAnimeList

A small project written with .NET 8 & React.

### Instructions

The following set up instructions is written for the Linux systems.

### BackEnd set up
```bash
# MyAnimeList Client ID here: https://myanimelist.net/apiconfig
dotnet user-secrets set "MyAnimeList:ClientId" "MYANIMELIST_CLIENT_ID" --project OurAnimeList

# JWT
dotnet user-secrets set "Jwt:Key" "SOMETHING_RANDOM" --project OurAnimeList
dotnet user-secrets set "Jwt:Issuer" "http://localhost:5000" --project OurAnimeList
dotnet user-secrets set "Jwt:Audience" "http://localhost:5173" --project OurAnimeList

# Up MySQL database container for the .NET app
cp ./environments/localhost/.env.example ./environments/localhost/.env
make up
```

### FrontEnd set up
```bash
cd web-react/

# Configure environment variables
cp .env.example .env
nano .env

npm install

# Ready to use :3
npm run dev
```

### OurAnimeList

A small project written with .NET 8 & React.

### Instructions

The following set up instructions is written for the Linux systems.

### BackEnd set up
```bash
# Configure app secrets file: secrets.json
cd OurAnimeList/
cp secrets.example.json secrets.json
nano secrets.json
cd ..

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

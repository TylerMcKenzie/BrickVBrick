# BrickVBrick
Competative Brick Smashing Game

## Prereqs

make sure that you have Node v6^ installed and Postgresql(most recent version)

## Installation

clone this repo ```git clone https://github.com/TylerMcKenzie/BrickVBrick.git```

run ```npm install```
once packages are installed you can run in one of two environments 
A. Production
1. create the database ```createdb brickvbrick_database```
2. change ```server/config.json``` 
```
"production": {
    "username": "your-username",
    "password": "your-password",
    "database": "brickvbrick_database",
    "host": "127.0.0.1",
    "port": "5432",
    "dialect": "postgres"
}
``` 
3. ```node_modules/.bin/sequelize db:migrate```
4. ```npm run build``` 
5. ```npm start``` 

B. Development
1. same as production step 1
2. change ```server/config.json``` 
```
"development": {
    "username": "your-username",
    "password": "your-password",
    "database": "brickvbrick_database",
    "host": "127.0.0.1",
    "port": "5432",
    "dialect": "postgres"
}
``` 
3. ```node_modules/.bin/sequelize db:migrate```
4. ```npm run dev``` 

C. Check it out
1. navigate to [http://localhost:3000](http://localhost:3000) to see the app in action
## Comments
Got any comments for me, or experience a bug send me an email at [tylrmckenz@gmail.com](mailto:tylrmckenz@gmail.com)

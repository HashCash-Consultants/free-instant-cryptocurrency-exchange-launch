
# Setup 
1. Install NodeJS from https://nodejs.org/en/download

2. After Installing NodeJs, you need to install angular cli using 
    npm install -g @angular/cli 

    reference  : https://angular.io/guide/setup-local

5. Pull branch source code using command git pull main.
6. Goto src->app folder and open file core-data.service.ts, search for keyword “this.BROKERID” (having commented text “Add your broker id here”), add your broker id there i.e 
this.BROKERID = <YOUR BROKER ID > // Add your broker id here



# Build
1. use command npm i --force.
2. To run the application locally use command (Optional)
ng serve -o
2. To build for production use following code
ng build –prod
If, you want to deploy in a directory or subdirectory of where your domain is pointed use following command
ng build –prod –base-herf /<YOUR DIRECTORY OR SUB DIRECTORY NAME>/


# Deployment
1. After build process gets completed , the build will be situated inside 
dist->Digital folder.
2. Deploy the files and folder inside dist->Digital folder to your server.

# Ape1r0n file downloader
 Download exam results no longer accessible from university website
 
## Usage
To run this Express application clone repo, navigate to project root folder, install Node dependencies and start the app. Once it is started, trigger downloadFiles endpoint with required query params: <br>
<b>lastFile</b> - id of last file uploaded to server  
<b>numOfFiles</b> - number of files you want to download 

Files are downloaded in decremental order and saved in folder DownloadedFiles with report listed at listFilesResult.csv

### Run Express app
1. Open terminal in root project folder and install dependencies: ```npm install```
2. Run app in terminal: ```DEBUG=myapp:* npm start```
3. Open browser, navigate to downloadFiles endpoint with required params: <b><a href="http://localhost:3000/downloadFiles?lastFile=50191&numOfFiles=3">http://localhost:3000/downloadFiles?lastFile=<i>50191</i>&numOfFiles=<i>3</i></a></b>

Check results in DownloadedFiles

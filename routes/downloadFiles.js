const express = require('express');
const router = express.Router();
const request = require('sync-request');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: 'listFilesResult.csv',
    //ID : Type : Name : URL 
    header: [
      {id: 'id', title: 'ID'},
      {id: 'type', title: 'File type'},
      {id: 'name', title: 'File name'},
      {id: 'url', title: 'File URL'},
    ],
    //if set appends to an existing file, skips header write 
    // append: true
  });

const baseUrl = 'http://www.apeiron-uni.com/lycboardclient/Detail.aspx?DocumentID=';

/* GET Download files */
router.get('/', async function(req, res, next) {
    //get params
    const numberOfFiles = req.query.numOfFiles;
    const lastFileNumber = req.query.lastFile;

    if(req.query.numOfFiles == undefined || req.query.lastFile == undefined){
        res.send('Please provide numOfFiles and lastFile as query params');
        return;
    }
    
    const fileList = [];
    var url;
    for(var i= lastFileNumber; i > lastFileNumber - numberOfFiles; i--){
        url = baseUrl + i;
        var apeironRes = request('GET', url);
        console.log('Req for: ' + i);
        if(apeironRes.headers['content-disposition']){
            //file
            console.log(apeironRes.headers['content-disposition']);

            //name header: attachment; filename=XXX.XX
            var name = apeironRes.headers['content-disposition'].split(';')[1].substring(10);
            //replace forward slash in file name with dash
            name = name.replace(/\//g, '-');

            //type header
            var type = apeironRes.headers['content-type'];

            //save file (already available in apeironRes.body)
            fs.writeFile('DownloadedFiles/' + name, apeironRes.body, (err, name) => {
                if (err){
                    console.log('Error while saving file');
                    console.log(err);
                }      
            });

            //ID : Type : Name : URL 
            var fileEntry = {
                id: i,
                type: type,
                name: name,
                url: url
            }
            fileList[lastFileNumber - i] = fileEntry;
        } else {
            //error message
            console.log('- No file for url: ' + url);
            var fileEntry = {
                id: i,
                type: '//',
                name: '//',
                url: url
            }
            fileList[lastFileNumber - i] = fileEntry;
        }
        
        //TODO add delay 
    }

    //create CSV 
    // csvWriter
    //     .writeRecords(fileList)
    //     .then(()=> {
    //         console.log('The CSV file was written successfully')
    //     });

    await csvWriter.writeRecords(fileList);
    console.log('The CSV file was written successfully');

    // res.send(fileList);
    res.send('Processing done, check <b>listFilesResult.csv</b> in project folder.');
});

module.exports = router;
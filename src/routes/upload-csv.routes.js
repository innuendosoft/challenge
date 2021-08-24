// APP Single Endpoint

// Import and instantiate required modules 
import '@babel/polyfill';
import { Router } from 'express';
import app from '../server';
import {connect} from '../database';
import { ObjectId } from 'mongodb';

const router = Router();
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');

// Define temporary folder for upload CSV files
const upload = multer({ dest: 'tmp/csv/' });

// Process the POST request, including the file field containing the CSV data
router.post('/', upload.single('file'), async (req, res) => {
   
    //Initiate variable that will contain the rows
    const fileRows = [];

    // Store provider id
    const providerName = req.body.provider;
    
    // Process the CSV file and load each line as an array
    csv.parseFile(req.file.path)
        .on("data", function (data) {
        fileRows.push(data); 
    })
    .on("end", function () {
        //Delete the file after processing
        fs.unlinkSync(req.file.path);

        //Iterate through the parsed rows 
        fileRows.forEach(async function(dataRow, rowIndex){
            
            //Async DB connect
            const db = await connect();

            //Get the configuration data for the requested provider
            //Field names in providers_layout table are the position of the column
            //Field values are the name of the column
            const result = await db.collection('providers_layout').findOne({ provider: providerName});
            
            //Initiate the json variable that will contain the data to be insterted 
            const jsonIns = {};

            //Loop though each field of the csv line
            //Associate it to a provider specific column name, if defined
            dataRow.forEach(async function(dataField, index, arr){
                if (typeof(result[index]) !== 'undefined'){
                    jsonIns[result[index]] = arr[index];
                }
            });

            //Do the db insert and automatically add an ID
            try{
                const resultIns =  await db.collection('providers_data').insertOne(jsonIns); 
            }
            catch(e){
                res.json('Fail');
            }
        });

        res.json('Success');
        
      })
})

export default router; 
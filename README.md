Assumptions
	csv is no pre-parsed (it is received in backend in raw format)
	csv contains no headers
	csv is in proper format
		fields are separated with comma(',')
	"provider" parameter is sent as part of the request
	provider exists in configurations table	
	"create" and "update" fields are provided in the csv file
	data is sent from an html multi-part form 
	
Design decisions
	REST pattern
	Asynchronous mode in database and file processing functions
	Non-relational DB engine (MongoDB) for data storage (both configuration and csv)
	
 API REFERENCE
 https://inuendosoft.stoplight.io/docs/challenge/
 
 {
    "openapi": "3.1.0",
    "info": {
        "title": "challenge",
        "version": "1.0",
        "summary": "Parse and load a CSV file",
        "description": "Receive a CSV file through post, along with provider identificator and process data accordingly"
    },
    "servers": [
        {
            "url": "http://localhost:3000"
        }
    ],
    "paths": {
        "/upload-csv": {
            "post": {
                "summary": "",
                "operationId": "post-upload-csv",
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                },
                "description": "Parse and load data from csv file for a specific provider",
                "requestBody": {
                    "content": {
                        "multipart/form-data": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "file": {
                                        "type": "object",
                                        "description": "provider data in csv format"
                                    },
                                    "provider": {
                                        "type": "string",
                                        "description": "provider for which the data while be loaded"
                                    }
                                },
                                "required": [
                                    "file",
                                    "provider"
                                ]
                            }
                        }
                    },
                    "description": "Data sent through a form in csv format. Also indicating provider for which the data will be processed."
                }
            }
        }
    },
    "components": {
        "schemas": {}
    }
}

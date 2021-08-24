
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const fs = require('fs');

chai.use(chaiHttp);
const url = 'http://localhost:3000';

describe('Parse a CSV: ',()=>{
    it('Should parse a csv file', (done) => {
    chai.request(url)
    .post('/upload-csv')
    .type('form')
    .attach('file', fs.readFileSync('test/data3.csv'), 'test/data3.csv')
    .field({provider:'Prov3'})
    .end( function(err,res){
    console.log(res.body)
    expect(res).to.have.status(200);
    done();
    });
    });
   });

   describe('Parse another CSV: ',()=>{
    it('Should parse a different file from a different provider', (done) => {
    chai.request(url)
    .post('/upload-csv')
    .type('form')
    .attach('file', fs.readFileSync('test/data3.csv'), 'test/data2.csv')
    .field({provider:'Prov2'})
    .end( function(err,res){
    console.log(res.body)
    expect(res).to.have.status(200);
    done();
    });
    });
   });

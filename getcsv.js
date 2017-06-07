'use strict'

var xr = require('xr')  ;
var fetch = require('fetch').fetchUrl;
var bodylist = 'ons,name,winner2017,sittingparty,majority,swing,lastpercentmaj,turnout,declarationtime,candidaterank,candidateparty,candidateshare,candidatesharechange,candidatevotes,candidatefirstname,candidatesurname,candidatesex\n';
var AWS = require('aws-sdk');
var s3 = new AWS.S3();


fetch('https://interactive.guim.co.uk/2017/06/ukelection2017-data/snap/full.json',function(error,meta,body){

var data = JSON.parse(body);
data.forEach(function(s){
    if (s.candidates) {
    s.candidates.forEach(function(c){    
    var line = `${s.ons},${(s.name).replace(/,/g," ")},${s.winningParty},${s.sittingParty},${s.majority},${s.swing},${s.lastPercentageMajority},${s.percentageTurnout},${s.mtime},${(s.candidates.indexOf(c)) + 1},${c.party},${c.percentageShare},${c.percentageShareChange},${c.votes},${c.firstName},${c.surname},${c.sex}\n`
    bodylist = bodylist += line;
    
    })
       
    }
 
})

console.log(bodylist);
 var s3params = {
        ACL: "public-read",
        Body: bodylist,
        CacheControl: "max-age=30",
        Bucket: "gdn-cdn/2017/06/general-election",
        Key: "allresults.csv",
        ContentType: "text/plain"
    }
    s3.putObject(s3params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

});


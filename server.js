//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');
var express = require('express')
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://sergeytest:1964@ds019846.mlab.com:19846/sergeydb';    

var app = express();

app.get('/',function(req,res){
    
});

  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
    var addresses = db.collection('addresses');
    addresses.insert({longURL:"google.com",shortURL:"goo.gl"});
    
    //Close connection
    db.close();
  }
});
//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');
var express = require('express')
var validator = require('validator');
var assert = require('assert');

var MongoClient = mongodb.MongoClient;
var mongoURL = 'mongodb://sergeytest:1964@ds019846.mlab.com:19846/sergeydb';    
console.log(mongoURL);
//process.env.MONGOLAB_URI//'
var app = express();

app.get('/',function(req,res){
  res.send("Pass a valid URL to get its shortened version (a number), or pass a previously generated shortened version to get redirected to the full URL")  
})
app.get('/:URL',function(req,res){
    
    var url = req.params.URL;

        MongoClient.connect(mongoURL, function (err, db) {
          if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
          } else {
            console.log('Connection established to', mongoURL);
            //Try to find address
            var addresses = db.collection('addresses');
            console.log("trying to match " + url)
            var foundAddress = addresses.findOne({shortURL:url},function(err, foundAddress){
                if (err) console.error(err);
                console.log(foundAddress)
                if (foundAddress) {
                    console.log("redirecting to " + foundAddress.longURL)
                    res.redirect("http://"+foundAddress.longURL)
                    db.close();
                    return;
                }
                else {
                    if (!validator.isURL(url)) {
                      res.end(url + " is not valid URL")
                      db.close();
                      return;
                    } else {
                        addresses.count(function(err,count){
                            if (err) console.error(err);
                            var newItem = {shortURL:count.toString(), longURL:url}
                            console.log("addding " + newItem)
                            res.end("added item " + JSON.stringify(newItem));
                            addresses.insert(newItem)
                            db.close();
                            return;
                        })
                        }
                    
                }
                //db.close()
            })
            
          }
        });
});

var port = +process.env.PORT
if (!port) port = 8080;

app.listen(port, function () {console.log(process.env.PORT,process.env.IP);
  //  console.log(process.env);
  console.log('Example app listening on port 8080!');
});

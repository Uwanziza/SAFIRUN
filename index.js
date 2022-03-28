const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const { reset } = require('nodemon');
const { url } = require('inspector');
const { type } = require('os');
var mongoose = require('mongoose');
require('dotenv').config();
var mysql = require('mysql');
const { read } = require('fs');

const app = express();
const port = 3000;


let pay= [];

app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

  const toRad = (e) => {
      return (e * Math.PI) / 180;
  }


// calculate the price between two  distance and then u generate  the total amount to pay
app.post('/calculate/estimation/', (req, res) => {

 const {pick_up_coordinate,drop_off_coordinate} = req.body;

 const radius = 6378; // in km
   
    // -1.9549365806535324, 30.115287760056706

    const lat1 = pick_up_coordinate.lat;
    const lat2 = drop_off_coordinate.lat;
    const lng1 = pick_up_coordinate.long;
    const lng2 = drop_off_coordinate.long;
  
    //Applied Haversine formula to find distance between two points on earth coordinates
  
    const xx = Math.pow(Math.sin(toRad(lat2 - lat1) / 2), 2); //sin squared latitude
    const yy = Math.pow(Math.sin(toRad(lng2 - lng1) / 2), 2); //sin squared longtude
  
    const vv = Math.sqrt(
      xx + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * yy
    );
  
    const distanceUsed = 2 * radius * Math.asin(vv); //measured in km

    let amountToPay = distanceUsed * 1000;//distance used
     
    const amount=amountToPay * 300;
    
    console.log(amount);
    
    console.log(distanceUsed);

  let bp=0;
    var move=["scooter","van"];//this is choosing the transport that the client will use
if(move.scooter=bp){
if (amountToPay <=4 ){ //amountToPay is the distance calculated above
      bp=2500
     console.log (bp);
    }
    else if (amountToPay <=5 && amountToPay>=10){
      bp=3500
      console.log(bp);
    }else if (amountToPay <=11 && amountToPay>=40){
      bp=5000
      console.log (bp)
    }
}
if (move.van=bp){
  if (amountToPay <=4 ){
    bp=8000
   console.log (bp);
  }
  else if (amountToPay <=5 && amountToPay>=10){
    bp=8500
    console.log(bp);
  }else if (amountToPay <=11 && amountToPay>=40){
    bp=9500
    console.log (bp)
  }
}

    res.send({status:true,message:'success',amountToPay});
    console.log('request made from client');

});

let orders = [];

app.post('/order/insert/', (req, res) => {

let {p_coords,d_coords} =req.body;
d_coords =d_coords.toString();
p_coords=p_coords.toString();

delete req.body.d_coords;
delete req.body.p_coords;
let object=({...req.body,d_coords,p_coords});
 con.query("insert into orders set ?",[(object)],(error,data)=>{
  if(error){
   console.log(error);
     res.status(404).send({message:'error'})
     return;
   }
   res.status(200).send({message:'success'})
 
 });

 });

multer = require('multer');

var upload = multer();//uploading images if they are in btn 1&4

app.post('/upload', upload.array('uploadedImages', 4), function(req, res, err) {
  if (err) {
    console.log('error');
    console.log(err);
  }
  var file = req.files;
  res.end();
  console.log(req.files);
});



var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password:"",
  database:'safirun'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("MySql db Connected!");

app.post('/status', function(req, res, next) {//To update the status in orders by id
  var {id, status,estimate} = req.body;
    var sql = `UPDATE orders SET status=? WHERE Id=?`;
    con.query(sql, [status, id], function (err, data) {
    if (err) throw err;
    console.log(data.affectedRows + " record(s) updated");
  });
  res.status(200).send({message:'success',estimate});

});
  
app.get('/get', function (req,res,next){//to get all orders in db
  var{id}=req.body;
  var sql=`SELECT * FROM orders`;
  con.query(sql,[id],function (err,data){
  if(err) throw err;
  // console.log(data);
  res.send({status:true,message:'success',data})
  });
});

//To get the wallet for the certain user
app.get('/getwallet/:username', function (req,res,next){//username is unique 
  var{username}=req.params;

  con.query(`SELECT * FROM wallet WHERE username = ?`,[username],function (err, data){
  if(err) {
    console.log(err)
    return;
  };
  if (data.length > 0) {
    res.send({status:200, message:'success',data});    
  } else {    
    res.send({status:404, message:'failed'});
  }
  });
});

});

app.listen(port, () => console.log(`Hello safi app listening on port ${port}!`));
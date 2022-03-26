app.get ('/get/:userId',function(req,res,next){
var {userId}=req.body;
var sql=`select * FROM wallet`;//incase u want to select by id u can use (select * userId FROM wallet);
con.query (sql,[userId],function (err,data){
if(err)throw err;
console.log(data);
res.send(message="succeas",data)
});
});
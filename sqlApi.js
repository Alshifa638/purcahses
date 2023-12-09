let express=require("express");
let app=express();
app.use(express.json());
app.use(function (req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Orihgin, X-Requested-With, Content-Type, Accept"

    );
    next();
});
var port = process.env.PORT || 2410;
app.listen(port,()=>console.log(`Listening on port ${port}!`));


const {Client}=require("pg");
const client=new Client({
    user : "postgres",
    password : "Sameem@1231231",
    database : "postgres",
    port:5432,
    host : "db.zywuwndohtsfwqsbcpvk.supabase.co",
    ssl:{ rejectUnauthorized: false},
});
 client.connect(function(res, error){
        console.log(`Connected!!!`);
    });

app.get("/shops",function(req,res,next){

    let sql="SELECT * FROM shops";
    client.query(sql,function(err,result){
        if(err) {res.status(404).send(err);
        console.log(err)}
        else  {
            res.send(result.rows);
        }
    });
});
app.get("/totalPurchase/shop/:id",function(req,res,next){
    let id=+req.params.id;
let sql=`SELECT productid,SUM(quantity) AS quantity FROM purchases
WHERE purchases.shopid=${id}
GROUP BY productid`
 
    client.query(sql,function(err,result){
        if(err) {res.status(404).send(err);}
             else res.send(result.rows);
    })
});

app.post("/shops",function(req,res,next){
    let values=Object.values(req.body);
  
   console.log(values)
    let sql=`INSERT INTO shops (name,rent) VALUES($1,$2)`;
    client.query(sql,values,function(err,result){
        if(err){ res.status(404).send(err);}
        else{
            res.send(`POST SUCCESS..NUM OF ROWS IS POST ${result.rowCount}`);
    }
    })
})


app.get("/products",function(req,res,next){

    let sql="SELECT * FROM products";
    client.query(sql,function(err,result){
        if(err) {res.status(404).send(err);
        console.log(err)}
        else  {
            res.send(result.rows);
        }
    });
});

app.get("/products/:id",function(req,res,next){
    let id=+req.params.id;
   
    let sql=`SELECT * FROM products WHERE productid=${id}`;
    client.query(sql,function(err,result){
        if(err) {res.status(404).send(err);}
        else if(result.length===0) { res.status(404).send("No data found");}
       
             else {res.send(result.rows[0])};
         
      
    })
 });

 app.get("/totalPurchase/product/:id",function(req,res,next){
    let id=+req.params.id;
    let sql=`SELECT shopid,SUM(quantity) AS quantity FROM purchases
    WHERE purchases.productid=${id}
    GROUP BY shopid`

    client.query(sql,function(err,result){
        if(err) {res.status(404).send(err);
            console.log(err)}
             else {res.send(result.rows)
                
            };
    })
});

app.post("/products",function(req,res,next){
    let values=Object.values(req.body);
  
   console.log(values)
    let sql=`INSERT INTO products (productName,category,description) VALUES($1,$2,$3)`;
    client.query(sql,values,function(err,result){
        if(err){ res.status(404).send(err);}
        else{
            res.send(`POST SUCCESS..NUM OF ROWS IS POST ${result.rowCount}`);
    }
    })
});


app.put("/products/:id", function(req,res,next){
    let id=+req.params.id;
    let productname=req.body.productname;
    let category=req.body.category;
    let description=req.body.description;
    let sql=`UPDATE products SET productname=\'${productname}\',category=\'${category}\',description=\'${description}\',productid=${id} WHERE productid=${id}`;

    client.query(sql,function(err,result){
        if(err) {res.status(404).send(err);
        console.log(err)}
       
         else{ res.send("Update success")}
    })
 })

 app.get("/purchases", function(req,res,next){
    let sort=req.query.sort;
    let shop=req.query.shop;
    let product=req.query.product;
    let options="";
    let optionArr=[];
  
    if(product){
    
       let  productArr=product.split(',')
       let productArr1=productArr[0].substring(2,3)
         productArr.length==2?
         productArr1=productArr[0].substring(2,3)+","+productArr[1].substring(2,3)

         :productArr.length==3?
         productArr1=productArr[0].substring(2,3)+","+productArr[1].substring(2,3)+","+ productArr[2].substring(2,3)

         :productArr.length==4?
         productArr1=productArr[0].substring(2,3)+","+productArr[1].substring(2,3)+","+ productArr[2].substring(2,3)+","+ productArr[3].substring(2,3)
         
         :productArr.length==5?
         productArr1=productArr[0].substring(2,3)+","+productArr[1].substring(2,3)+","+ productArr[2].substring(2,3)+","+ productArr[3].substring(2,3)+","+ productArr[4].substring(2,3)
       
         :productArr.length==6?
         productArr1=productArr[0].substring(2,3)+","+productArr[1].substring(2,3)+","+ productArr[2].substring(2,3)+","+ productArr[3].substring(2,3)+","+ productArr[4].substring(2,3)
         +","+ productArr[5].substring(2,3)

         :productArr.length==7?
         productArr1=productArr[0].substring(2,3)+","+productArr[1].substring(2,3)+","+ productArr[2].substring(2,3)+","+ productArr[3].substring(2,3)+","+ productArr[4].substring(2,3)
         +","+ productArr[5].substring(2,3) +","+ productArr[6].substring(2,3) 
         :productArr.length==8?
         productArr1=productArr[0].substring(2,3)+","+productArr[1].substring(2,3)+","+ productArr[2].substring(2,3)+","+ productArr[3].substring(2,3)+","+ productArr[4].substring(2,3)
         +","+ productArr[5].substring(2,3) +","+ productArr[6].substring(2,3)  +","+ productArr[7].substring(2,3) 
         :productArr.length==9?
         productArr1=productArr[0].substring(2,3)+","+productArr[1].substring(2,3)+","+ productArr[2].substring(2,3)+","+ productArr[3].substring(2,3)+","+ productArr[4].substring(2,3)
         +","+ productArr[5].substring(2,3) +","+ productArr[6].substring(2,3) +","+ productArr[7].substring(2,3) +","+ productArr[8].substring(2,3) 
         :productArr.length==10?
         productArr1=productArr[0].substring(2,3)+","+productArr[1].substring(2,3)+","+ productArr[2].substring(2,3)+","+ productArr[3].substring(2,3)+","+ productArr[4].substring(2,3)
         +","+ productArr[5].substring(2,3) +","+ productArr[6].substring(2,3) +","+ productArr[7].substring(2,3) +","+ productArr[8].substring(2,3) +","+ productArr[9].substring(2,3) 
         :''

    options=options?`${options} AND purchases.productid IN (${productArr1})` : `WHERE purchases.productid IN (${productArr1})`;
   // optionArr.push(productArr)

  }  

  if(shop){
    let ss=shop.substring(2,3)
    options=options?`${options} AND purchases.shopid=${ss}` :`  WHERE purchases.shopid=${ss}`;
    //optionArr.push(`${ss}`);
}
if(sort){
    if(sort=="QtyAsc") {
        
        options=`${options} ORDER BY quantity ASC`;
    }
    if(sort==="QtyDesc") {
        
        options=`${options} ORDER BY quantity DESC`;
    }

    if(sort=="ValueAsc") {
        
        options=`${options} ORDER BY quantity*price ASC`;
    }
    if(sort==="ValueDesc") {
        
        options=`${options} ORDER BY quantity*price DESC`;
    }
}
    let sql=`SELECT
    purchaseid,
   productname,
   purchases.shopid,
   purchases.productid,
   name,
   quantity,
   price
  FROM purchases
  JOIN products
  ON purchases.productid =products.productid
  JOIN shops
    ON purchases.shopid =shops.shopid ${options}`
    client.query(sql,function(err,result){
        if(err) {res.status(404).send(err);
        console.log(err)}
        else  {
            res.send(result.rows);
        }
    });
});
app.get("/purchases/shops/:id",function(req,res){
    let id=+req.params.id;
    let sql=`SELECT * FROM shops JOIN purchases ON shops.shopid=purchases.shopid WHERE purchases.shopid=${id}`
    // WHERE purchases.shopid=${id}`;
    client.query(sql,function(err,result){
        if(err) {res.status(404).send(err);}
             else res.send(result.rows);
    })
});
app.get("/purchases/products/:id",function(req,res){
    let id=+req.params.id;

    let sql=`SELECT * FROM products JOIN purchases ON products.productid=purchases.productid WHERE purchases.productid=${id}`

    client.query(sql,function(err,result){
        if(err) {res.status(404).send(err);
        console.log(err)}
             else res.send(result.rows);
    })
   
});



app.post("/purchases",function(req,res,next){
    let values=Object.values(req.body);
  
   console.log(values)
    let sql=`INSERT INTO purchases (productid,shopid,quantity,price) VALUES($1,$2,$3,$4)`;
    client.query(sql,values,function(err,result){
        if(err){ res.status(404).send(err);}
        else{
            res.send(`POST SUCCESS..NUM OF ROWS IS POST ${result.rowCount}`);
    }
    })
});


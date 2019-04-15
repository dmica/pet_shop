//call the express framework to action
var express = require("express"); 
//invoke the express package into action
var app = express();

//call sql to action
var mysql = require('mysql');

//set default view engine
app.set("view engine", "ejs");
var fs = require('fs');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended:true }));




//This declares the content of the contact.json file as a variable
var contact = require("./model/contact.json");
//This declares the content of the review.json file as a variable
var review = require("./model/review.json");

//call the accesss to the views folder and allow content to be rendered
app.use(express.static("views"));

//call fileUpload middleware
const fileUpload = require('express-fileupload');
app.use(fileUpload());


//call the accesss to the script folder and allow content to be rendered
app.use(express.static("script"));

//call the accesss to the images folder and allow content to be rendered
app.use(express.static("images"));



//create conncectivity to sql database

// ************Add details here to log in to gearhost****************
const db = mysql.createConnection({
 

  
 
});

//check sql database connection status

db.connect((err) => {
     if(err){
    console.log("The Connection Failed");
    }
    else {
        console.log("The connection to MySQL database is great!");
    }
 });



app.get('/', function(req, res){ 
    res.render("index")
    console.log("The Message was sent")
    
});



//###MYSQL DATA STARTS HERE###



// create a route to create a database table

//app.get('/createtable', function(req, res){
        
//let sql = 'CREATE TABLE products (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Pet varchar(255), Available varchar(255), Image varchar(255), Price int);'
    
//let query = db.query(sql, (err,res) => {
        
//        if(err) throw err;
        
        
//    });
   
//    res.send("SQL Worked!");
    
    
//});



//drop table products
//app.get('/droptable', function(req, res){
        
//let sql = 'DROP TABLE products;'
    
//let query = db.query(sql, (err,res) => {
        
//        if(err) throw err;
        
        
//    });
    
//    res.send("SQL Worked!");
    
    
//});



// Route to create a product by hardcode
app.get('/createproduct', function(req, res){
    let sql = 'INSERT INTO products (Name, Pet, Available, Image, Price) VALUES ("Catit Design Senses Super Roller Circuit", "Cats", "Yes", "product_catit.jpg", 15)'
     let query = db.query(sql, (err,res) => {
        if(err) throw err;
    });
    res.send("Product Created");
 
});


//route to show products from database
app.get('/productssql', function(req, res){
    
    let sql = 'SELECT * FROM products';
    let query = db.query(sql, (err,res1) => {
        
        if(err) throw err;
        
        res.render('showproducts', {res1})
        
    });
    
    //res.send("Product Created");
    
    
});

// route to render create product page
app.get('/createsql', function(req, res){
    res.render('createsql')
   
    
});



// route to add new product 

app.post('/createsql', function(req, res){
    // post request to upload an image 
    //get image from the form
    let sampleFile = req.files.sampleFile
      filename = sampleFile.name;
     //move the data from the form to the desired location
    sampleFile.mv('./images/' + filename, function(err){
        if(err)
        return res.status(500).send(err);
        console.log("Image is " + req.files.sampleFile)
        
    });
    

    let sql = 'INSERT INTO products (Name, Pet, Available, Image, Price) VALUES ("'+req.body.name+'", "'+req.body.pet+'", "'+req.body.available+'", "'+filename+'", '+req.body.price+')'
     let query = db.query(sql, (err,res) => {
        if(err) throw err;
    });
    res.redirect("/productssql");
 
});



//route to edit sql product
app.get('/edit/:id', function(req, res){
    let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'" '
    let query = db.query(sql, (err, res1) => {
        if(err) throw err;
        console.log(res1);
        
        
        res.render('edit', {res1});
        
    });
    
});


// Post request URL to edit product with SQL
app.post('/editsql/:id', function(req, res){
    //get image from the form
    let sampleFile = req.files.sampleFile
      filename = sampleFile.name;
     //move the data from the form to the desired location
    sampleFile.mv('./images/' + filename, function(err){
        if(err)
        return res.status(500).send(err);
        console.log("Image is " + req.files.sampleFile)
        
    });
    
       let sql = 'UPDATE products SET Name = "'+req.body.name+'", Pet = "'+req.body.pet+'", Available = "'+req.body.available+'", Image = "'+filename+'", Price = '+req.body.price+' WHERE Id = "'+req.params.id+'"      '
       let query = db.query(sql, (err,res) => {
        if(err) throw err;
    });
    res.redirect("/productssql");
    
    
});




// route to delete sql product 
app.get('/deletesql/:id', function(req, res){
   
   let sql = 'DELETE FROM products WHERE Id = '+req.params.id+' ' 
   let query = db.query(sql, (err, res ) => {
       if(err) throw err;
  
       
   });
   
   
   res.redirect("/productssql");
    
    
});


// route to show individual product

app.get('/show/:id', function(req, res){
    
    let sql = 'SELECT * FROM products WHERE Id = '+req.params.id+'';
    let query = db.query(sql, (err,res1) => {
        
        if(err) throw err;
        
        res.render('show', {res1})
        
    });
    
   // res.send("Product Created");
    
    
});


//###MYSQL DATA STOPS HERE###




//###JSON DATA STARTS HERE###




//route to get about page
app.get('/about', function(req,res){
   res.render("about")
    console.log("You are on the way to about us page!")
    
});



//route to get contacts page
app.get('/contacts', function(req,res){
   res.render("contacts", {contact})
    console.log("You are on the way to contacts page!")
    
});



//route to get user to add contacts page
app.get('/add_contacts', function(req,res){
   res.render("add_contacts")
    console.log("You are on the page where you can add new Contacts!")
    
});



//function to add contacts
app.post('/add_contacts',function(req,res){
    //Write a function to find the max id in my JSON file
    function getMax(contacts, id) {
      var max
      for (var i=0; i<contacts.length; i++){
          if(!max || parseInt(contact[i][id]) > parseInt (max[id]))
          max = contacts[i];
      }
      console.log("The max id is" + max)
      return max;
    }
    
    //call the getMax function and pass some information to it
    var maxCid = getMax(contact,"id")
    
    //set new variable id for 1 larger than current max id
    var newId = maxCid.id +1;
    
    console.log("New id is " + newId);
    var json = JSON.stringify(contact)
    
    var contactsx ={
        
        id: newId,
        street: req.body.street,
        city: req.body.city,
        country: req.body.country,
        hours: req.body.hours,
        email: req.body.email,
        phone: req.body.phone,
        fax: req.body.fax
        
    }
    
    //push data to JSON file
    fs.readFile('./model/contact.json', 'utf8', function readfileCallback(err){
        if(err){
            throw(err)
        } else {
            //add the new contact to the JSON file
            contact.push(contactsx) 
            //structure the new data nicely in JSON file
            json = JSON.stringify(contact, null, 4) 
            fs. writeFile('./model/contact.json',json, 'utf8')
            
        }
    })
    
     res.redirect('/contacts')
    
});


//route to edit contact
app.get('/editcontact/:id', function(req,res){
    
    function chooseContact(indOne){
       return indOne.id === parseInt(req.params.id)
       }

    
    var indOne = contact.filter(chooseContact)
     res.render('editcontact' , {res:indOne});
    
});



//post request to edit contact 

app.post('/editcontact/:id', function(req,res){
    
    var json = JSON.stringify(contact);
    
    var keyToFind = parseInt(req.params.id);  // Find the data we need to edit
    var data = contact // Declare the json file as a variable called data
    var index = data.map(function(contact){return contact.id;}).indexOf(keyToFind) // map out data and find what we need
    
    
   
    var z = parseInt(req.params.id)
    
    
     contact.splice(index, 1, {
         
        id: z,
        street: req.body.street,
        city: req.body.city,
        country: req.body.country,
        hours: req.body.hours,
        email: req.body.email,
        phone: req.body.phone,
        fax: req.body.fax
         
     });
    
    json = JSON.stringify(contact, null, 4);
    fs.writeFile("./model/contact.json", json, 'utf8' );
    
    res.redirect("/contacts");
    
});



//function to delete a contact
app.get('/delete_contacts',function(req,res){
    
    var json = JSON.stringify(contact);
    //get the id from the URL parametar that is going to be deleted
    var keyToFind = parseInt(req.params.id);
    //declare JSON file as a data veriable
    var data = contact 
    //map the data and find information you need
    var index = data.map(function(contact){return contact.id;}).indexOf(keyToFind)
    //delete only one item
    contact.splice(index, 1);
    
    json = JSON.stringify(contact,null, 4)
    fs.writeFile('./model/contact.json', json, 'utf8')
    
    console.log("Contact is deleted")
    res.redirect('/contacts')
});



//route to get reviews page
app.get('/reviews', function(req,res){
   res.render("reviews",{review})
    console.log("You are on the way to reviews page!")
    
});



//route to get user to add reviews page
app.get('/add_reviews', function(req,res){
   res.render("add_reviews")
    console.log("You are on the page where you can add new Reviews!")
    
});



//function to add reviews
app.post('/add_reviews',function(req,res){
    //Write a function to find the max id in my JSON file
    
    function getMax(reviews, id) {
      var max
      for (var i=0; i<reviews.length; i++){
          if(!max || parseInt(review[i][id]) > parseInt (max[id]))
          max = reviews[i];
      }
      
      return max;
      
    }
    
    //call the getMax function and pass some information to it
    var maxCid = getMax(review,"id")
    
    //set new variable id for 1 larger than current max id
    var newId = maxCid.id +1;
    
    console.log("New id is " + newId);
    
    //tell the application to get JSON ready to modify
    var json = JSON.stringify(review)
    
    var reviewsx ={
        
        id: newId,
        title: req.body.title,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        recommend: req.body.recommend
        
    }
    
    //push data to JSON file
    fs.readFile('./model/review.json', 'utf8', function readfileCallback(err){
        if(err){
            throw(err)
        } else {
            //add the new review to the JSON file
            review.push(reviewsx) 
            //structure the new data nicely in JSON file
            json = JSON.stringify(review, null, 4) 
            fs. writeFile('./model/review.json',json, 'utf8')
            
        }
    })
    
     res.redirect('/reviews')
    
});



//route to edit review
app.get('/editreview/:id', function(req,res){
    
    function chooseReview(indOne2){
       return indOne2.id === parseInt(req.params.id)
       }

    
    var indOne = review.filter(chooseReview)
     res.render('editreview' , {res:indOne});
    
});



//post request to edit review

app.post('/editreview/:id', function(req,res){
    
    var json = JSON.stringify(review);
    
    var keyToFind = parseInt(req.params.id);  // Find the data we need to edit
    var data = review // Declare the json file as a variable called data
    var index = data.map(function(review){return review.id;}).indexOf(keyToFind) // map out data and find what we need
    
    
   
    var z = parseInt(req.params.id)
    
    
     review.splice(index, 1, {
         
        id: z,
        title: req.body.title,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        recommend: req.body.recommend
         
     });
    
    json = JSON.stringify(review, null, 4);
    fs.writeFile("./model/review.json", json, 'utf8' );
    
    res.redirect("/reviews");
    
});



//function to delete a review
app.get('/delete_reviews/',function(req,res){
    
    var json = JSON.stringify(review);
    //get the id from the URL parametar that is going to be deleted
    var keyToFind = parseInt(req.params.id);
    //declare JSON file as a data veriable
    var data = review 
    //map the data and find information you need
    var index = data.map(function(review){return review.id;}).indexOf(keyToFind)
    //delete only one item
    review.splice(index, 1);
    
    json = JSON.stringify(review,null, 4)
    fs.writeFile('./model/review.json', json, 'utf8')
    
    console.log("Review is deleted")
    res.redirect('/reviews')
})






//###JSON STOPS HERE###

// post request url to search database, use an existing page (products) to display results

app.post('/search', function(req, res){
    let sql = 'SELECT * FROM products WHERE Name LIKE  "%'+req.body.search+'%"  OR Pet LIKE  "%'+req.body.search+'%"    ';
    let query = db.query(sql, (err,res1) => {
        
        if(err) throw err;
        
        res.render('showproducts', {res1})
        
    });
    
   // res.send("Product Created");
    
    
});



//set up a way for application to run 

//****************************DON'T CHANGE BELOW THIS LINE***************************

app.listen(process.env.PORT || 3000,process.env.IP || "0.0.0.0.", function(){
    
    console.log("Pet Shop application is now live!")
    
});
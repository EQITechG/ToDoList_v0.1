// This is a version 2 that uses MongoDB database instead
//Any code  didn't comment on has alreasdy been commented on a previous similar code

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
const https = require("https");
mongoose.connect("mongodb+srv://dudish:Test123@cluster0.8oomc4i.mongodb.net/todolistDB"); //This time mongo DB is hosted in the cloud MongoDB
let day = date.getDate();//gets the date function from the data.js 
let today = day.toString(); // did not end up using this, because adding brackets to ejs tag, made is a string and solved my problems.
const itemsSchema = new mongoose.Schema({ 
    name: {
      type: String
    }
  });

const Items = mongoose.model("Items", itemsSchema); 

    const cook = new Items ({name: "Cook"});
    const shower = new Items ({name: "Shower"});
    const sleep = new Items ({name: "Sleep"});
    const defaultItems = [cook, shower, sleep]; //putting all new data in one array for easy use.

    const listSchema = new mongoose.Schema({ //making a new table for other pages made out from root
        name: String,
          items: [itemsSchema]
        });

    const List = mongoose.model("List", listSchema); //initialising the said new table called list

   

app.get("/",(req,res)=>{

    async function displayList(){
        const foundItems = await Items.find({}); //find exisiting items in database


if(foundItems.length === 0){ // Check if the array of exisiting items is 0 aka nothting inside it
    Items.insertMany(defaultItems).then(function () { //if so enter default items from above
        console.log("Successfully saved defult items to DB"); 
      }).catch(function (err) {//mongoose protocol for catching errors.
        console.log(err);
      });
      res.redirect("/");//return back to root, which should check again and then go to the else statement below
}else{
    res.render("list", {listTitle:day, newListItems:foundItems});//render list from database
}    
    }
    displayList();//since it's all a function, call the function
});

app.post("/", (req,res)=>{
    let itemName = req.body.newItem;
    let pageItem = req.body.button; 
    const addItem = new Items ({name: itemName});//when someone enters a new extract that item to this variable
if (pageItem === day){ 
    addItem.save(); // upload the item to database
    res.redirect("/"); //return to root to display it
} else{
    List.findOne({name: pageItem}).then(foundList => {
        foundList.items.push(addItem);
        foundList.save();
        res.redirect("/" +pageItem);
    
          })
}

});

// THE POST AND GET CODE CODE BELOW WAS VERY HARD TO ACHIEVE BECAUSE MONGOOSE STOPPED SUPPORTING CALL BACK FUNCTIONS, HENCE I USED A WEBSITE TO CONVERT THE CODE TO ASYNC AND AWAIT FUNCTIONS https://masteringjs.io/tutorials/tools/callback-to-async-await


app.post("/delete", async function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === day) {
      await Items.findByIdAndRemove(checkedItemId);
      console.log("Successfully deleted checked item.");
      res.redirect("/");
    } else {
      await List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}});
      res.redirect("/" + listName);
    }
});

app.get("/:customListName", async function(req, res){
    const customListName = _.capitalize(req.params.customListName);
  
    const foundList = await List.findOne({name: customListName});
    if (!foundList){
        //Create a new list
        const list = new List({
            name: customListName,
            items: defaultItems
        });
        await list.save();
        res.redirect("/" + customListName);
    } else {
        //Show an existing list
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
    }
});

app.get("/about", (req,res)=>{
    res.render("about");
})

app.listen(3000,()=>{
console.log("Server Running on Port 3000")
})
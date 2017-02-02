var mysql = require("mysql");
var inquirer = require('inquirer');
var userName;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
//add password and database you are using
    password: "!A@bv&iC$14#",
    database: "Bamazon"
});

list();

function list(){
inquirer.prompt([
    {
        name: "choices",
        message: "What would you like to do to the Inventory?",
        type: "list",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product","Cancel"]
    }
]).then(function(answer){
    if(answer.choices === "View Products for Sale"){
        viewProducts();
    } else if(answer.choices === "View Low Inventory"){
        viewInventory();
    } else if(answer.choices === "Add to Inventory"){
        addInventory();
    } else if(answer.choices === "Add New Product"){
        addProduct();
    } else {
        connection.end();
    }
})
};
function viewProducts(){
     connection.query("SELECT * FROM products", function(err,res){
    if (err) throw err;
     for(i=0;i<res.length;i++){
    	console.log('Item ID:' + res[i].id + ' Product Name: ' + res[i].product_name + ' Price: $' + res[i].price +' Quantity: '+ res[i].stock_quantity)
     }
     newTran();
     })
};

function viewInventory(){
    connection.query("SELECT * FROM products", function(err,res){
        if(err) throw err;
         for(i=0;i<res.length;i++){
             if(res[i].stock_quantity < 5){
             console.log('Item ID:' + res[i].id + ' Product Name: ' + res[i].product_name + ' Quantity: '+ res[i].stock_quantity);
         }
        }
        newTran();
    })
};

function addInventory(){
    inquirer.prompt([
        {
            name: "add",
            message: "What Product would you like to Update?",
            validate: function(value){
                var valid = value.match(/^[0-9]+$/)
                if (valid){
                    return true;
                }
                    return 'Please enter a valid Item ID';
            }
        }, {
                   name: "amount",
                   message: "How many did you recevie?",
                   validate: function(value){
                       var valid = value.match(/^[0-9]+$/)
                       if(valid){
                           return true;
                       }
                       return "Please enter a valid number";
                   }
               }
    ]).then(function(answer){    
               connection.query("SELECT * FROM products WHERE id = ?", [answer.add], function(err,res){
                   connection.query("UPDATE products SET ? WHERE ?",[{
                       stock_quantity: res[0].stock_quantity + parseInt(answer.amount)
                   },{
                       id: answer.add
                   }], function(err,res){});
               })
               console.log("Inventory Updated");
               newTran();
           })
};

function addProduct(){
    inquirer.prompt([
        {
            name: "name",
            message: "Products name: ",
            type: "input"
        },{
            name: "department",
            message: "Department: ",
            type: "input"
        },{
            name: "price",
            message: "Price: ",
            type: "input"
        },{
            name: "stock",
            message: "Stock Quantity: ",
            type: "input"
        }
    ]).then(function(answer){
        connection.query("INSERT INTO products SET ?",{
            product_name: answer.name,
            department_name: answer.department,
            price: answer.price,
            stock_quantity: answer.stock
        }, function(err,res){});
        newTran();
    })
};

function newTran (){
    inquirer.prompt([
        {
            name: "Tran",
            message: "Would you like to a new Transaction",
            type: "confirm"
        }
    ]).then(function(answer){
        if(answer.Tran){
            list();
        } else {
            console.log("Have a great day!");
            connection.end();
        }
    })
};
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

inquirer.prompt([
    {
        name: "products",
        message: "Press Enter to see the items for sale."
    }
    ]).then(function(product){
        connection.query("SELECT id, product_name, price FROM products", function(err,res){
    if (err) throw err;
     for(i=0;i<res.length;i++){
    	console.log('Item ID:' + res[i].id + ' Product Name: ' + res[i].product_name + ' Price: $' + res[i].price)
     }
    buy();
    })
    });
   
var buy = function(){
    inquirer.prompt([
        {
            name: "items",
            message: "Which item would you like to buy? Choice by Item ID #.",
            validate: function(value){
                var valid = value.match(/^[0-9]+$/)
                if (valid){
                    return true;
                }
                    return 'Please enter a valid Item ID';
            }
        }, {
            name: "quantity",
            message: "How many would you like?",
            validate: function(value){
                var valid = value.match(/^[0-9]+$/)
                if (valid){
                    return true;
                }
                    return 'Please enter quantity';
            }
        }
    ]).then(function(answer){
        connection.query('SELECT * FROM products WHERE id = ?', [answer.items], function (err, res){
            if(answer.quantity > res[0].stock_quantity){
                console.log("Insufficient Quantity")
                console.log("Please choice a lower quantity");
                buy();
            } else {
                totalCost = res[0].price * answer.quantity;
                console.log("Thank you for shopping at Bamazon")
                console.log("Total: $"+ totalCost);
                again();
                connection.query("UPDATE products SET ? WHERE ? ", [{
                    stock_quantity: res[0].stock_quantity - answer.quantity
                },{
                    id: answer.items
        }], function(err, res){});
            }

        })
        
    })
};

function again(){
    inquirer.prompt([
        {
            name: "order",
            message: "Would you like to place a other order?",
            type: "confirm"
        }
    ]).then(function(answer){
        if(answer.order){
            buy();
        } else {
            console.log("Have a great day!");
            connection.end();
        }
    })
};
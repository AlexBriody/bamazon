var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "jiachi67",
  database: "bamazon_db"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  queryAllProducts();
});

function queryAllProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");
    buyProducts();
  });
 
};

function buyProducts() {
  inquirer.prompt([

    {
      type: "input",
      name: "productID",
      message: "What is the ID of the product you would like to buy?",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
    {
      type: "input",
      name: "productUnits",
      message: "How many units of the product would you like to buy?",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }


  ]).then(function (answer) {

    var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE item_id = ?";
   
    connection.query(query, [answer.productID], function (err, res) {

      for (var i=0; i < res.length; i++) {

        if(res[i].stock_quantity < answer.productUnits) {
          console.log("\n Your quantity exceeds the amount in stock. Please choose another quantity.")
          buyProducts();
        } else {
          
          console.log("\nYour order has been fulfilled.");
          console.log("\nOrder Summary:");
          console.log("You have purchased " + answer.productUnits + " of " + res[i].product_name);
          var totalCost = answer.productUnits * res[i].price;
          var formattedCost = totalCost.toFixed(2);
          console.log("Your total cost is $" + formattedCost);
          var newStockQuantity = res[i].stock_quantity - answer.productUnits;
          console.log("The new updated stock quantity of " + res[i].product_name + " is " + newStockQuantity);
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: newStockQuantity
              },
              {
                product_name: res[i].product_name 
              }
            ],
            function(error) {
              if (error) throw err;
              
            }
          );
          // connection.end();
        }//closing for else statement

      }//closing for for loop

      listProducts();
      function listProducts() {

        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            console.log("\nAll products for sale:");
            for (var i = 0; i < res.length; i++) {
                console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
            }
            console.log("-----------------------------------");
            connection.end();
        });
    
    }
    })//closing for connection.query

  });//closing for .then

}//closing for buyProducts function


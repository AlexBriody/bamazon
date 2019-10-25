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
    manageProducts();
});


function manageProducts() {
    inquirer.prompt([

        {
            type: "list",
            name: "selectedChoice",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }

    ]).then(function (answer) {

        switch (answer.selectedChoice) {
            case "View Products for Sale":
                listProducts();
                break;

            case "View Low Inventory":
                viewLowInventory();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":
                addProduct();
                break;

            case "exit":
                connection.end();
                break;
        }

    });//closing for .then

}//closing for manageProducts function

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

function viewLowInventory() {
    console.log("We are going to view low inventory!");
    connection.end();
}

function addInventory() {
    inquirer.prompt([

        {
            type: "input",
            name: "productName",
            message: "Enter the name of the product for which you would like to add inventory:",
        },
        {
            type: "input",
            name: "productInventory",
            message: "Enter the amount you wish to add to inventory:",
        },


    ]).then(function (answer) {

        connection.query("SELECT * FROM products", function(err,res) {

            var chosenItem;
            for (var i=0; i < res.length; i++) {
                if(res[i].product_name === answer.productName) {
                    chosenItem = res[i];
                }
            };

            connection.query("UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: chosenItem.stock_quantity + parseInt(answer.productInventory)
                },
                {
                    product_name: answer.productName
                }
            ],
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " products updated!\n");
               
                listProducts();
            }

            );//closing for connection.query

        });//closing for connection.query
        
    });//closing for .then

}//closing for addInventory function

function addProduct() {
    inquirer.prompt([

        {
            type: "input",
            name: "productName",
            message: "Enter the name of the product you wish to add:",
        },
        {
            type: "input",
            name: "productDepartment",
            message: "Enter the department of the product you wish to add:",
        },
        {
            type: "input",
            name: "productPrice",
            message: "Enter the price of the product you wish to add:",
        },
        {
            type: "input",
            name: "productQuantity",
            message: "Enter the quantity of the product you wish to add:",
        },

    ]).then(function (answer) {

        connection.query(

            "INSERT INTO products SET ?",
            {
                product_name: answer.productName,
                department_name: answer.productDepartment,
                price: answer.productPrice,
                stock_quantity: answer.productQuantity
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " product inserted!\n");

                listProducts();
            }

        );//closing for connection.query
    });//closing for .then
}//closing for addProduct function
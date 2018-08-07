var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});


function start () {
    connection.connect(function(err) {
        if (err) throw err;
        openStore();            
    });
};

start();

function openStore() {
    connection.query("SELECT * FROM products", function(err, res) {
        console.log("\nWelcome! Please see our inventory below:\n")
        if (err) throw err;
        res.forEach(item => {
            console.log(`Product ID: ${item.item_id} | Product: ${item.product_name} | Price: ${item.price}`)
        })
        askUser();
    })
}

function askUser () {
    inquirer.prompt([
        {
        name: "openStore",
        type: "input",
        message: "\nPlease insert the product ID of the item you would like to buy.",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
]).then(function(answer) {
    connection.query("SELECT * FROM products WHERE item_id=?", [answer.openStore], function(err, res) {
        if (err) throw err;
        console.log(`You have selected to purchase the following item: ${res[0].product_name}.\n`);
        console.log(`There are ${res[0].stock_quantity} of this item remaining.`);
        //confirmChoice();
        inquirer.prompt([{
            name: "howMany",
            type: "input",
            message: "How many would you like to purchase?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
            }
        ]).then(function(answer) {
            console.log(`You have chosen to purchase ${answer.howMany}.`);

            if (answer.howMany <= res[0].stock_quantity) {
                console.log(`You have successfully purchased ${answer.howMany} ${res[0].product_name}.\n`);
                console.log(`Thank you for your purchase, have a nice day!`);
                //connection.query(`UPDATE products SET ${res[0].stock_quantity} = ${res[0].stock_quantity} - ${answer.howMany} WHERE ${res[0].product_name}`);
                console.log(`There are now ${res[0].stock_quantity} left in stock.`)
                connection.end();
            } else {
                console.log('Insufficient Quantity!')
                connection.end();
            }
        })
    })
})
}



//function confirmChoice () {
//    inquirer.prompt([{
//        name: "confirm",
//        type: "confirm",
//        message: "Are you sure?"
//    }
//]).then(function(answer) {
//   if (answer.confirm == true) {
//       console.log("Yes")
//   } else {
//       console.log("No")
//   }
//   connection.end();
//})
//}

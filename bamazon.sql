DROP DATABASE IF exists bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
   item_id INT NOT NULL AUTO_INCREMENT,
   product_name VARCHAR (45) NOT NULL,
   department_name VARCHAR (45) NOT NULL,
   price DECIMAL (10,2) NOT NULL,
   stock_quantity INTEGER (45) NOT NULL,
   PRIMARY key (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("skooter", "toy", 73.99, 100),
("bicycle", "sports", 174.99, 200),
("tricycle", "children", 65.55, 80),
("skateboard", "toy", 45.99, 85),
("roller blades", "sports", 55.99, 120),
("digital clock", "electronics", 35.99, 170),
("analog clock", "electronics", 45.99, 130),
("neon sign", "electronics", 75.85, 40),
("plasma ball", "toy", 25.99, 55),
("lava lamp", "toy", 29.99, 65);

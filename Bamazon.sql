create database Bamazon;

use Bamazon;

create table products (
	id integer(11) auto_increment not null primary key,
    
    product_name varchar(30) not null,
    
    department_name varchar(30) not null,
    
    price integer(10) not null,
    
    stock_quantity integer(10) not null
    );
    
insert into products(product_name, department_name, price, stock_quantity)
values ("Plates", "Houseware", 5, 50),
("Football", "Sports", 10, 15),
("PS4", "Gaming", 250, 5),
("LightBulbs", "Houseware", 2, 3),
("Boat", "Fishing", 140, 2),
("Shoes", "Clothing", 15, 15),
("Milk", "Dairy", 3, 100),
("Cake", "Bakery", 20, 3),
("Ham", "Deli", 2, 30),
("Lego", "Toys", 18, 6);
fs = require('fs')


var orders = {};
var fees = {};


var promiseOrders = new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…
  fs.readFile('orders.json', 'utf8', function (err,data) {
  if (err) {
    reject("error");
  }
 // console.log(data);
  orders = JSON.parse(data);
  //console.log(orders);
  resolve(orders);
});

});



var promiseFees = new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…
  fs.readFile('fees.json', 'utf8', function (err,data) {
  if (err) {
    reject("error");
  }
 // console.log(data);
  fees = JSON.parse(data);
 // console.log(fees);
  resolve(fees);
});


});





promiseOrders.then(function(orders) {
//  console.log(result); // "Stuff worked!"
   	   var orders_prices = {};
   	   var orders_fund = {};
   

	   promiseFees.then(function(feesResult) {
        
	   orders_prices = printPart1(orders, fees) 

	   console.log(orders_prices.orders[0].order_items);  

	   orders_fund = printPart2(orders_prices,fees)

	   console.log(orders_fund.orders[0].funds); 

	}, function(err) {
	  console.log(err); // Error: "It broke"
	});

}, function(err) {
  console.log(err); // Error: "It broke"
});





function printPart1(orders,fees){

	var item = {};
	var total = 0;
	var orders_prices = {};
	orders_prices.orders = [];

	for(var i=0 ; i < orders.length ; i++){

		var order = {};
		
		total = 0;
		console.log("Order ID: " + orders[i].order_number)

		order.order_number = orders[i].order_number;

		order.order_items = [];

		

		for(var j =0 ; j < orders[i].order_items.length; j++)
		{
			
			//console.log(orders[i].order_items[j]);
			feeItem = findItemInFees(fees,orders[i].order_items[j].type);
		//	console.log(feeItem);
			price = calculate(feeItem,orders[i].order_items[j].pages);


			console.log("Orders item ("+(j+1)+") "+ orders[i].order_items[j].type +" : "+ price)
			total = total + parseFloat(price);

			var order_item = {};
			order_item.type = orders[i].order_items[j].type;
			order_item.price = price;


			order.order_items[order.order_items.length] = order_item;
		}
		order.total = total;

		orders_prices.orders[orders_prices.orders.length] = order;

		console.log("Order Total: "+ total);
		console.log("             ");							
	}


	return orders_prices;

}

function printPart2(orders_prices,fees){

	//console.log(orders_prices);	
	var orders_fund = {};

	orders_fund.orders = [];

	for(var i=0; i<orders_prices.orders.length ;i++) {

		var order = {}

		order.order_number = orders_prices.orders[i].order_number;

		order.funds = [];

		for(var j=0; j<orders_prices.orders[i].order_items.length ; j++) {

		
		feeItem = findItemInFees(fees,orders_prices.orders[i].order_items[j].type);


			for(var k =0 ; k < feeItem.distributions.length ; k++){

				var fund = {};


				fund.fund_name = feeItem.distributions[k].name;

				fund.amount = feeItem.distributions[k].amount;
				
				order.funds[order.funds.length] = fund ;
			}



		}

		orders_fund.orders[orders_fund.orders.length] = order

	//console.log(order);	

	}

	return orders_fund;

}

function calculate(feeItem, pages){

	var amount = 0.0;
	for(var i = 0 ; i< feeItem.fees.length ; i++){

		if(feeItem.fees[i].type === "flat"){

			amount = amount + parseFloat(feeItem.fees[i].amount);

		}else if(feeItem.fees[i].type === "per-page"){
			var add = feeItem.fees[i].amount*pages;
			amount = amount + add;

		}


	}

   return amount;
}

function findItemInFees(fees, itemtype){



	for(var i =0 ; i < fees.length ;i++)
	{
	
		if(fees[i].order_item_type === itemtype)
		return fees[i];


	}

}



// Order ID: <order number>  
//    Order item <type>: $<price>
//    Order item <type>: $<price>
//    ..
//    ..

//    Order total: $<total>
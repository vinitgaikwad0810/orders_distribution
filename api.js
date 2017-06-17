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
   
   

	   promiseFees.then(function(feesResult) {
        
	   printPart1(orders, fees)   
	}, function(err) {
	  console.log(err); // Error: "It broke"
	});

}, function(err) {
  console.log(err); // Error: "It broke"
});





function printPart1(orders,fees){

	var item = {};
	var total = 0;

	for(var i=0 ; i < orders.length ; i++){
		
		total = 0;
		console.log("Order ID: " + orders[i].order_number)

		for(var j =0 ; j < orders[i].order_items.length; j++)
		{
		
			//console.log(orders[i].order_items[j]);
			feeItem = findItemInFees(fees,orders[i].order_items[j].type);
		//	console.log(feeItem);
			price = calculate(feeItem,orders[i].order_items[j].pages);
			console.log("Orders item ("+(j+1)+") "+ orders[i].order_items[j].type +" : "+ price)
			total = total + parseFloat(price);


		}



		console.log("Order Total: "+ total);
		console.log("             ");							
	}




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
Part 1: Fees

The file fees.json describes fees that are applied to different types of items in an order. Each type of item in a order can have one or more fees associated with it.
The total cost for the order item is the aggregate of all of fees associated with that item. There are different types of fees. Flat fees are simply a single charge. Per-page fees add an additional fee on top of a flat fee for each page after the first.

Challenge:

Write Javascript that outputs to the console the prices for each order item and order in the orders.json file based on the fees in the fees.json file. 

The output should be of the form:  
```
Order ID: <order number>  
   Order item <n>: $<price>  
   ..
   ..

   Order total: <total>
```

Two example files have been provided:  `fees_example.json` and `orders_example.json`.  For these inputs, the expected output would be:
```
Order ID: 12345
   Order item 1: $5.00
   Order item 2: $6.00

   Order total: $11.00

Order ID: 12346
   Order item 1: $10.00

   Order total: $10.00
```


Part 2: Distributions

Each fee has a set of funds associated with it. The money associated with each fee is split among the funds based on the amount specified in the distribution. Any extra money associated with the order that isn't allocated to a fund should be assigned to a generic "Other" fund.

Challenge:

Write Javascript that outputs to the console the fund distributions for each order in the orders.json file, and then output the totals in each fund after processing all orders.

The output should be of the form:  
```
Order ID: <order number>  
  Fund - <fund_n>: $<amount>
  Fund - <fund_m>: $<amount>
  ..  
  ..  

Order ID: <order number>
  Fund - <fund_n>: $<amount>
  Fund - <fund_m>: $<amount>
  ..  
  ..  
  ..  

Total distributions:
  Fund - <fund_n>: $<amount>
  Fund - <fund_m>: $<amount>
  ..  
  ..  
```

Two example files have been provided:  `fees_example.json` and `orders_example.json`.  For these inputs, the expected output would be:
```
Order ID: 12345
  Fund - Printing Fund: $10.00
  Fund - Other: $1.00

Order ID: 12346
  Fund - Printing Fund: $10.00

Total distributions:
  Fund - Printing Fund: $20.00
  Fund - Other: $1.00
```


Returning the completed challenge:

You may choose to send us a link to a public cloud file-sharing service (google drive, dropbox, etc), or you can send an invitation to view a private github repository with your solution.  The link you provide may be used by multiple individuals from our team, so make sure your link is not limited one person.

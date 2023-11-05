import { readFile  } from 'fs/promises';
import chalk, { foregroundColorNames } from 'chalk';
import { EventEmitter } from 'events'
const log = console.log;

const PER_PAGE = "per-page"
const FLAT = "flat"
// const fees_example = await  readFile("fees_example.json", "utf-8");
const fees_example = await  readFile("fees.json", "utf-8");
const orders_example = await  readFile("orders_example.json", "utf-8");
// const orders_example = await  readFile("orders.json", "utf-8");
// const orders_example = await  readFile("orders_1.json", "utf-8");
// const orders_example = await  readFile("orders_2.json", "utf-8");
const eventEmitter = new EventEmitter()


const feesObject = JSON.parse(fees_example)
const ordersObject = JSON.parse(orders_example)


eventEmitter.on('start', () => {
    let orders_string = ''
    ordersObject.forEach(order => {
        orders_string += getOrderFees(order)
    });
    
    log(chalk.white(orders_string));
})


function getOrderFees(order) {
    const { order_number, order_items } = order;
    const order_items_elements = [];
        order_items.forEach(order_element => {
            let amountByOrder = getOrderItemAmount(order_element)
            order_items_elements.push(amountByOrder);
        });
    let orderItemsString = createOrderItemString(order_items_elements)
    let totalString = createTotalOrderString(order_items_elements)
    let stringBase = `
Order ID: ${order_number}
`;
    stringBase += orderItemsString += totalString

    return stringBase;
}

function createOrderItemString (amountsArray){
    let orderString = ''
    amountsArray.forEach((amount, index) => {
        orderString += `   Order item ${index}: $${amount}.00\n`
    });
    return orderString
}
function createTotalOrderString (amountsArray){
    const sum = amountsArray.reduce((accumulator, currentValue) => {
  return accumulator + currentValue
},0);
    return  `\n   Order total : $${sum}.00\n`
    
}
function getOrderItemAmount(items) {
    const { type, pages } = items;
    return  feeByOrderItemType(type,pages);
}

function feeByOrderItemType(type,pages) {
    let total = 0
    feesObject.forEach(fee => {
        const { order_item_type, fees } = fee;
            if( order_item_type === type){
                if (Object.keys(fees).length < 2 ){
                    const { amount } = fees[0];
                    total = pages * parseInt(amount)          
                } else {
                    if(pages > 1) {
                        let firstPageFee = amountByFeeType(FLAT ,fees) 
                        let aditionalPagesFees = amountByFeeType(PER_PAGE ,fees) 
                        total =   (aditionalPagesFees * pages - 1 ) + firstPageFee
                    } else {
                        let firstPageFee = amountByFeeType(FLAT,fees ) 
                        total = pages * parseInt(firstPageFee)          
                    }


                }
            }
        });
        return  total;
}

function amountByFeeType (type,fees) {
    for (let i = 0; i < fees.length; i++) {
         const element = fees[i];
         if (element.type == type) {
             return parseInt(element.amount)
        }
    } 
}


eventEmitter.emit('start');

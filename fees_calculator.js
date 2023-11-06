import { readFile  } from 'fs/promises';
import chalk  from 'chalk';
import { EventEmitter } from 'events'
const log = console.log;

const PER_PAGE = "per-page"
const FLAT = "flat"
const REAL_PROPERTY_RECORDING = "Real Property Recording"
const BIRTH_CERTIFICATE = "Birth Certificate"

// const fees_example = await  readFile("fees_example.json", "utf-8");
const fees_example = await  readFile("fees.json", "utf-8");
// const orders_example = await  readFile("orders_example.json", "utf-8");
const orders_example = await  readFile("orders.json", "utf-8");
// const orders_example = await  readFile("orders_1.json", "utf-8");
// const orders_example = await  readFile("orders_2.json", "utf-8");
const eventEmitter = new EventEmitter()

const feesObject = JSON.parse(fees_example)
const ordersObject = JSON.parse(orders_example)

eventEmitter.on('start_distributionCalculator', () => {
    let orders_string = ''
    ordersObject.forEach(order => {
        orders_string += getOrderDistributions(order)
    });
    log(chalk.white(orders_string));
})
eventEmitter.on('start_feeCalculator', () => {
    let orders_string = ''
    ordersObject.forEach(order => {
        orders_string += getOrderFees(order)
    });
    log(chalk.white(orders_string));
})

function getOrderDistributions(order) {
    const { order_number, order_items } = order;
       let distributionString
       let otherFundString =''
       let baseString = createBaseString(order_number)
        order_items.forEach(order_element => {
            let distributionCost
            let distributions 
            const {type} = order_element
            if (type === REAL_PROPERTY_RECORDING ) {
                 distributionCost = getDistributionTotalCostByOrderItemType(REAL_PROPERTY_RECORDING)
                 distributions =  getDistributionsByOrderType(REAL_PROPERTY_RECORDING)
            }else if (type === BIRTH_CERTIFICATE) {
                distributionCost = getDistributionTotalCostByOrderItemType(BIRTH_CERTIFICATE)
                distributions = getDistributionsByOrderType(BIRTH_CERTIFICATE)
            }
            let totalOrderAmount = getOrderItemAmount(order_element)
             distributionString  = createDistributionString(distributions)
            if(totalOrderAmount !== distributionCost) {
                otherFundString += createOtherDistributionString(totalOrderAmount, distributionCost, distributionCost)
            }
        });
    
    return baseString  += distributionString += otherFundString
}
function getOrderFees(order) {
    const { order_number, order_items } = order;
    const order_items_elements = [];
        order_items.forEach(order_element => {
            let totalOrderAmount = getOrderItemAmount(order_element)
            order_items_elements.push(totalOrderAmount);
        });
    let orderItemsString = createOrderItemString(order_items_elements)
    let totalString = createTotalOrderString(order_items_elements)
    let baseString = createBaseString(order_number)

    return   baseString += orderItemsString += totalString
}

function createBaseString (order_number) {
return `
Order ID: ${order_number}
`;
}
function createDistributionString (distributions ) {
    let string = ''
    distributions.forEach(distribution => {
        const {name , amount} = distribution
        string += `     Fund - ${name}: $${parseInt(amount)}.00\n`
    });
    return string
}
function createOtherDistributionString (totalOrderAmount ,distributionCost ) {
        let string = ''
        string += `     Fund - Other: $${totalOrderAmount - distributionCost}.00\n`
    return string
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
function getDistributionTotalCostByOrderItemType (orderItemType) {  
    let distributionCost = 0
    feesObject.forEach(fee => {
        const {distributions, order_item_type} = fee
        if (order_item_type === orderItemType) {
        distributions.forEach(element => {
            const { amount } = element
                distributionCost  = distributionCost + parseInt(amount) 
            });
        }
    })

return distributionCost
}
function getDistributionsByOrderType (orderType){
    let distribution
    feesObject.forEach(element => {
            const {order_item_type, amount, distributions} = element
            if (order_item_type === orderType) {
                distribution = distributions
            }
    });
    return distribution
}

function amountByFeeType (type,fees) {
    for (let i = 0; i < fees.length; i++) {
         const element = fees[i];
         if (element.type == type) {
             return parseInt(element.amount)
        }
    } 
}

log(chalk.yellow('----------Fee calculator-------------'))
eventEmitter.emit('start_feeCalculator');
log(chalk.yellow('----------Distribution calculator-------------'))
eventEmitter.emit('start_distributionCalculator');
log(chalk.yellow('-----------------------------'))
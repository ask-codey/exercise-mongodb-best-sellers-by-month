// Riverbend Bike Shop's Best Sellers by Month: five report pipelines for you to write.
//
// Each function gets `db`, which works like mongosh. Riverbend's sales are in two collections (they're in the data
// folder): 8 customers and 40 orders, from November 2025 to December 2026. They look like these:
//
//   db.customers  { _id: 1, name: "Alex", email: "alex@example.com" }
//   db.orders     { _id: 7003, customerId: 2, orderedAt: ISODate("2026-01-07T21:10:00Z"), status: "shipped",
//                   total: 199,
//                   items: [ { productId: 104, name: "Summit Helmet", price: 89, quantity: 1 },
//                            { productId: 106, name: "Beacon Rear Light", price: 25, quantity: 3 },
//                            { productId: 105, name: "Beacon Front Light", price: 35, quantity: 1 } ] }
//
// An order's status is "shipped" or "canceled": one order, 7031, was canceled. Each line item copies its product's
// name and price, so no report here needs the products collection. Riverbend is in the "America/Los_Angeles" time zone.
//
// In each function, replace the empty pipeline, [], with the stages of your own, after the word return.
// Every function starts out giving back every document unchanged, so its test fails until your pipeline is right.
// You can try a pipeline in mongosh first (README.md, "Try a pipeline in mongosh") and paste it in.

// mongosh's helpers for ids, dates and money. Function 3 uses ISODate; leave this line as it is.
import { ObjectId, ISODate, NumberDecimal } from "./test/mongosh-helper.js";

/*
 * 1. Count the line items in all 40 orders, the canceled one and last year's included: one per item in an order's
 *    items array.
 *
 *    Gives back one document: [ { lineItems: 69 } ]
 */
export function countLineItems(db) {
  return db.orders.aggregate([]);
}

/*
 * 2. The top 5 products by units sold, counting the shipped orders only (every year). Each row is the product's
 *    name in _id and its units sold (the quantities added up) in units, most units first.
 *
 *    Gives back 5 rows, starting with these two:
 *      { _id: "Chain Care Kit", units: 25 }
 *      { _id: "Beacon Rear Light", units: 21 }
 */
export function topFiveProducts(db) {
  return db.orders.aggregate([]);
}

/*
 * 3. Sales per month for 2026: the shipped orders placed from ISODate("2026-01-01") up to, but not including,
 *    ISODate("2027-01-01"), one row per month, counted on Riverbend's clock (timezone "America/Los_Angeles").
 *    Each row has the month as text in _id, written "%Y-%m", the orders' totals added up in sales, and how many
 *    orders in orders. Months in order, January first.
 *
 *    Gives back 12 rows, from { _id: "2026-01", sales: 288, orders: 3 } to { _id: "2026-12", sales: 1400, orders: 3 }.
 *    Order 7009 was placed on February 28 at 22:30 in Riverbend, which is already March 1 in UTC, so it counts in
 *    February: { _id: "2026-02", sales: 286, orders: 4 }.
 */
export function salesByMonth(db) {
  return db.orders.aggregate([]);
}

/*
 * 4. Each customer's total spend on shipped orders (every year), with their name brought in from customers by
 *    $lookup. Each row has only two fields: name and spent. Most spent first.
 *
 *    Gives back 6 rows, starting with { name: "Jordan", spent: 4199 } and ending with { name: "Ken", spent: 509 }.
 */
export function customerSpend(db) {
  return db.orders.aggregate([]);
}

/*
 * 5. The customers who haven't ordered yet, for a welcome email: start from customers, and bring in each one's
 *    orders with $lookup. Each row has the customer's _id and name only.
 *
 *    Gives back 2 rows: { _id: 4, name: "Maya" } and { _id: 8, name: "Ana" }.
 */
export function customersWithoutOrders(db) {
  return db.customers.aggregate([]);
}

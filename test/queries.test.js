// Tests for queries.js. Run them with: npm test
// Each test calls one of your functions on Riverbend's 8 customers and 40 orders (data/customers.json and
// data/orders.json, loaded fresh before every test) and checks the rows its pipeline gives back. You don't need to
// change this file.
import { test } from "node:test";
import assert from "node:assert/strict";
import { startTestDatabase, run } from "./mongosh-helper.js";
import { countLineItems, topFiveProducts, salesByMonth, customerSpend, customersWithoutOrders } from "../queries.js";

startTestDatabase();

// Writes rows the way mongosh shows them, for the messages: { _id: 'Chain Care Kit', units: 25 }
// A list or a document inside a row is shortened to [...] or {...}, and only the first 12 rows are written.
function show(rows) {
  const value = (v) => typeof v === "string" ? `'${v}'` : v instanceof Date ? `ISODate('${v.toISOString()}')`
    : Array.isArray(v) ? "[...]" : v !== null && typeof v === "object" ? "{...}" : String(v);
  const shown = rows.slice(0, 12).map((row) => "{ " + Object.entries(row).map(([key, v]) => `${key}: ${value(v)}`).join(", ") + " }");
  return (shown.join(", ") || "no rows") + (rows.length > 12 ? `, and ${rows.length - 12} more` : "");
}

// Runs an aggregate() function and checks its rows against the rows expected, in this order.
async function checkRows(yourFunction, expected, message) {
  const answer = await run(yourFunction);
  assert.ok(Array.isArray(answer),
    `${yourFunction.name} should give back the rows an aggregate() makes, but it gave back ${answer}. Keep db.<collection>.aggregate([ ... ]) after return.`);
  assert.deepEqual(answer, expected,
    `${message}\nExpected ${expected.length} rows: ${show(expected)}\nYour pipeline gave ${answer.length}: ${show(answer)}`);
}

test("1) countLineItems gives [ { lineItems: 69 } ]", async () => {
  await checkRows(countLineItems, [{ lineItems: 69 }],
    "1) countLineItems should count the 69 line items in all 40 orders, with $unwind and then $count named lineItems.");
});

test("2) topFiveProducts gives the 5 best sellers of the shipped orders, from Chain Care Kit (25 units) to Summit Helmet (10)", async () => {
  await checkRows(topFiveProducts, [
    { _id: "Chain Care Kit", units: 25 },
    { _id: "Beacon Rear Light", units: 21 },
    { _id: "Trail Light 800", units: 20 },
    { _id: "Beacon Front Light", units: 19 },
    { _id: "Summit Helmet", units: 10 },
  ], "2) topFiveProducts should give the top 5 products by units sold in the shipped orders, most first. The canceled order 7031 doesn't count: with it, Beacon Rear Light would show 24.");
});

test("3) salesByMonth gives the 12 months of 2026 on Riverbend's clock, with 2026-02 at 286 from 4 orders", async () => {
  await checkRows(salesByMonth, [
    { _id: "2026-01", sales: 288, orders: 3 },
    { _id: "2026-02", sales: 286, orders: 4 },
    { _id: "2026-03", sales: 1552, orders: 3 },
    { _id: "2026-04", sales: 415, orders: 3 },
    { _id: "2026-05", sales: 335, orders: 3 },
    { _id: "2026-06", sales: 834, orders: 4 },
    { _id: "2026-07", sales: 1510, orders: 3 },
    { _id: "2026-08", sales: 453, orders: 3 },
    { _id: "2026-09", sales: 139, orders: 2 },
    { _id: "2026-10", sales: 817, orders: 3 },
    { _id: "2026-11", sales: 1107, orders: 3 },
    { _id: "2026-12", sales: 1400, orders: 3 },
  ], "3) salesByMonth should give one row per month of 2026 for the shipped orders, January first, counted with timezone \"America/Los_Angeles\". Without the timezone, order 7009 lands in 2026-03 and order 7022 in 2026-07.");
});

test("4) customerSpend gives the 6 customers who ordered, with their names, from Jordan (4199) to Ken (509)", async () => {
  await checkRows(customerSpend, [
    { name: "Jordan", spent: 4199 },
    { name: "Rosa", spent: 1818 },
    { name: "Leo", spent: 1546 },
    { name: "Alex", spent: 612 },
    { name: "Priya", spent: 606 },
    { name: "Ken", spent: 509 },
  ], "4) customerSpend should give each customer's total on shipped orders, most first, with only name and spent in each row.");
});

test("5) customersWithoutOrders finds Maya (4) and Ana (8)", async () => {
  const answer = await run(customersWithoutOrders);
  assert.ok(Array.isArray(answer),
    `customersWithoutOrders should give back the rows an aggregate() makes, but it gave back ${answer}. Keep db.customers.aggregate([ ... ]) after return.`);
  const rows = [...answer].sort((a, b) => a._id - b._id);
  assert.deepEqual(rows, [{ _id: 4, name: "Maya" }, { _id: 8, name: "Ana" }],
    `5) customersWithoutOrders should find the 2 customers with no orders, each row with only _id and name.\nExpected 2 rows: { _id: 4, name: 'Maya' }, { _id: 8, name: 'Ana' }\nYour pipeline gave ${rows.length}: ${show(rows)}`);
});

# Exercise: Best Sellers by Month

Exercise code for the lesson **Exercise: Best Sellers by Month** in the MongoDB in Depth course on [ask-codey.com](https://www.ask-codey.com).

Riverbend Bike Shop wants the numbers behind its sales dashboard: how many line items it has sold, its top 5 products by units, its sales in each month of 2026, what each customer has spent, and which customers haven't ordered yet. You'll write each one as an aggregation pipeline in `queries.js`, and tests run your pipelines on Riverbend's 8 customers and 40 orders and check the rows they give back.

## What's here

- `queries.js`: the five functions, each returning an empty pipeline, `aggregate([])`, for now. The comment above each one says exactly which rows it should give back, with examples. For you to finish.
- `data/customers.json` and `data/orders.json`: Riverbend's 8 customers and 40 orders, from November 2025 to December 2026. Ready to use.
- `data/load-into-mongosh.js`: loads those collections into mongosh, so you can try a pipeline there first. Ready to use.
- `test/queries.test.js`: the tests that run your pipelines. You don't need to change this file.
- `test/mongosh-helper.js`: the helper that runs your mongosh pipelines for the tests, with a throwaway MongoDB. You don't need to read or change it.
- `package.json`: the packages the tests use, and the MongoDB version they download if your computer has none. Ready to use.

The word `export` in front of each function lets the tests use it, and the `import` line at the top of `queries.js` brings in mongosh's helpers, such as `ISODate`. Leave both as they are.

## Before you start

In VS Code's terminal, in this folder, install the packages the tests use (once):

```bash
npm install
```

## Try a pipeline in mongosh

Every answer is one mongosh statement, so you can try it at the mongosh prompt before you paste it in. Start mongosh in this folder, choose a practice database, and load the data:

```bash
mongosh
```

```mongodb
use best_sellers
load("data/load-into-mongosh.js")
```

It prints `customers: 8 documents` and `orders: 40 documents`, then `true`. Then try a pipeline, such as `db.orders.aggregate([ { $unwind: "$items" }, { $count: "lineItems" } ])`, and type `exit` when you're done.

## Check your work

```bash
npm test
```

At first every test fails: that is expected. Each pipeline you finish turns its test green. A failing test's message says which rows it expected and which rows your pipeline gave, for example *2) topFiveProducts should give the top 5 products by units sold in the shipped orders, most first.*, followed by both lists of rows.

The tests start their own throwaway MongoDB, so they never touch your databases. If you installed MongoDB on your computer in the course's setup lesson, the tests use it. If you didn't, the first `npm test` downloads MongoDB 9.0.8 for the tests (nearly 1 GB on Windows, about 180 MB on a Mac) and keeps it for every exercise after this one.

## The rules

- Write one mongosh statement in each function, after the word `return`: `db.orders.aggregate([ ... ])`, or `db.customers.aggregate([ ... ])` for the last one.
- Use the stages from the course's lessons: `$match`, `$group`, `$sort`, `$limit`, `$project`, `$count`, `$unwind` and `$lookup`, and `$dateToString` for the months.
- Each row has exactly the fields its comment shows, with the same names: no more, no fewer.

## Tips

- Say the question in words first, then find the stage that does it: items in an array need `$unwind`, a name from another collection needs `$lookup`, a month is a piece of a date.
- Build each pipeline one stage at a time in mongosh, and look at the rows after each stage before you add the next.
- Only shipped orders count in functions 2, 3 and 4, and the canceled order has items in it, so leaving out the `$match` changes the numbers.
- Riverbend counts its months on its own clock. Two orders were placed late on the last evening of a month, which is already the next month in UTC.
- After a `$lookup`, the matches are in an array, even when there is only one.

## Hand it in

When it works, push your solution to a public repo of your own on GitHub, then paste that repo's address into **Submit your exercise** on the lesson page at [ask-codey.com](https://www.ask-codey.com). That's what completes the lesson. The lesson page shows the Git commands, step by step.

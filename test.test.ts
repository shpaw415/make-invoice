import { test } from "bun:test";
import { Invoice } from ".";
import data from "./data_example.json"

test("create pdf", async () => {
    const invoce = new Invoice();

    const pdf = await invoce.make({
        ...data,
        curency: {
            type: "CAD",
            hex: "\u0024"
        },
        region: "CA",
        items: [
            {
                amount: 5,
                description: [{ item: "first item" }, { item: "other description" }],
                unit_price: 5
            },
            {
                amount: 10,
                description: [{ item: "second item" }, { item: "other description" }],
                unit_price: 7.5
            }
        ]
    });

    await Bun.write("test.pdf", pdf);
});
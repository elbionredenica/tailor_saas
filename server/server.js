import express from "express";
import cors from "cors";
import dresses from "./routes/dresses.js";
import clients from "./routes/clients.js";
import orders from "./routes/orders.js";
import expenses from "./routes/expenses.js";
import rentals from "./routes/rentals.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json({ limit: '500mb' }));
app.use("/dress", dresses);
app.use("/client", clients)
app.use("/order", orders)
app.use("/expense", expenses)
app.use("/rental", rentals)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
import express from "express";

import db from "../db/connection.js";

import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
    let collection = await db.collection("expenses_db");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

router.get("/:id", async (req, res) => {
    let collection = await db.collection("expenses_db");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200)
})

router.post("/", async (req, res) => {
    try {
        let dress_id = null;
        if (req.body.dress_id) {
            dress_id = new ObjectId(req.body.dress_id);
        }

        let newDocument = {
            dress_id: dress_id,
            description: req.body.description,
            order_date: req.body.order_date,
            arrival_date: req.body.arrival_date,
            status: req.body.status,
            price: req.body.price
        };
        let collection = await db.collection("expenses_db");
        let result = await collection.insertOne(newDocument);
        res.send(result).status(204);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding record");
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        let dress_id = null;
        if (req.body.dress_id) {
            dress_id = new ObjectId(req.body.dress_id);
        }
        const updates = {
            $set: {
                dress_id: dress_id,
                description: req.body.description,
                order_date: req.body.order_date,
                arrival_date: req.body.arrival_date,
                status: req.body.status,
                price: req.body.price
            }
        };

        let collection = await db.collection("expenses_db");
        let result = await collection.updateOne(query, updates);
        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating record");
    }
}); 

router.delete("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };

        const collection = db.collection("expenses_db");
        let result = await collection.deleteOne(query);

        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting record");
    }
})

export default router;
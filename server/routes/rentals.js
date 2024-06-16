import express from "express";

import db from "../db/connection.js";

import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
    let collection = await db.collection("rent_db");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

router.get("/:id", async (req, res) => {
    let collection = await db.collection("orders_db");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200)
})

router.post("/", async (req, res) => {
    try {
        const client_id = new ObjectId(req.body.client_id);
        const dress_id = new ObjectId(req.body.dress_id);

        let newDocument = {
            booking_client_id: client_id,
            dress_id: dress_id,
            date_booked_start: req.body.date_booked_start,
            date_booked_end: req.body.date_booked_end,
            rent_price: req.body.rent_price,
            status: req.body.status
        };
        let collection = await db.collection("rent_db");
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
        const client_id = new ObjectId(req.body.client_id);
        const dress_id = new ObjectId(req.body.dress_id);
        const updates = {
            $set: {
                booking_client_id: client_id,
                dress_id: dress_id,
                date_booked_start: req.body.date_booked_start,
                date_booked_end: req.body.date_booked_end,
                rent_price: req.body.rent_price,
                status: req.body.status
            }
        };

        let collection = await db.collection("rent_db");
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

        const collection = db.collection("rent_db");
        let result = await collection.deleteOne(query);

        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting record");
    }
})

export default router;
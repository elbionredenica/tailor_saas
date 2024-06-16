import express from "express";

import db from "../db/connection.js";

import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
    let collection = await db.collection("dresses_db");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

router.get("/:id", async (req, res) => {
    let collection = await db.collection("dresses_db");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200)
})

router.post("/", async (req, res) => {
    try {
        let newDocument = {
            name: req.body.name,
            description: req.body.description,
            image_url: req.body.image_url,
            attributes: req.body.attributes || {},
            available_for_rent: req.body.available_for_rent,
            is_booked: req.body.is_booked,
            current_booking_id: req.body.current_booking_id,
            has_been_rent_before: req.body.has_been_rent_before,
            previous_rent_ids: req.body.previous_rent_ids,
            rent_details: req.body.rent_details || {}
        };
        let collection = await db.collection("dresses_db");
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
        const updates = {
            $set: {
                name: req.body.name,
                description: req.body.description,
                image_url: req.body.image_url,
                attributes: req.body.attributes || {},
                available_for_rent: req.body.available_for_rent,
                is_booked: req.body.is_booked,
                current_booking_id: req.body.current_booking_id,
                has_been_rent_before: req.body.has_been_rent_before,
                previous_rent_ids: req.body.previous_rent_ids,
                rent_details: req.body.rent_details || {}
            }
        };

        let collection = await db.collection("dresses_db");
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

        const collection = db.collection("dresses_db");
        let result = await collection.deleteOne(query);

        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting record");
    }
})

export default router;
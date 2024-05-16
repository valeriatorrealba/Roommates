const express = require('express');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const app = express();
const port = 3000;

const { getroommate } = require("./usuario");
const { updateDebeRecibe } = require("./calculo");

app.listen(port, console.log(`Servidor ON puerto ${port}`))

app.use(express.json());
app.use(express.static('public'));

app.post("/roommate", async (req, res) => {
    try {
        const newRoommate = await getroommate();
        res.status(201).send(newRoommate);
    } catch (error) {
        res.status(500).send(`Algo salió mal: ${error.message}`);
    }
});

app.get("/roommates", (req, res) => {
    try {
        const roommatesJSON = JSON.parse(fs.readFileSync("roommates.json", "utf-8"));
        res.send(roommatesJSON);
    } catch (error) {
        res.status(500).send(`Algo salió mal: ${error.message}`);
    }
});

app.get("/gastos", (req, res) => {
    try {
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf-8"));
        res.send(gastosJSON);
    } catch (error) {
        res.status(500).send(`Algo salió mal: ${error.message}`);
    }
});

app.post("/gasto", (req, res) => {
    try {
        const { roommate, descripcion, monto } = req.body;
        const gasto = { id: uuid(), roommate, descripcion, monto };
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf-8"));

        gastosJSON.gastos.push(gasto);

        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
        res.status(201).send("Gasto agregado con éxito");
    } catch (error) {
        res.status(500).send(`Algo salió mal: ${error.message}`);
    }
});

app.put("/gasto", (req, res) => {
    try {
        const { id } = req.query;
        const { roommate, descripcion, monto } = req.body;
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf-8"));

        gastosJSON.gastos = gastosJSON.gastos.map((g) => g.id === id ? { id, roommate, descripcion, monto } : g);
        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
        updateDebeRecibe(id, monto);

        res.send("Gasto modificado con éxito");
    } catch (error) {
        res.status(500).send(`Algo salió mal: ${error.message}`);
    }
});

app.delete("/gasto", (req, res) => {
    try {
        const { id } = req.query;
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf-8"));

        gastosJSON.gastos = gastosJSON.gastos.filter((g) => g.id !== id);
        
        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
        res.send("Gasto eliminado con éxito");
    } catch (error) {
        res.status(500).send(`Algo salió mal: ${error.message}`);
    }
});

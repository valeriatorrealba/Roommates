const axios = require("axios");
const fs = require("fs");
const { v4: uuid } = require('uuid');

let getroommate = async ()  =>{
    try {
        const { data } = await axios.get("https://randomuser.me/api")
        const randomRoommate = data.results[0];
        const roommate = {
            id: uuid().slice(30),
            nombre: `${randomRoommate.name.first} ${randomRoommate.name.last}`,
            debe: debe(),
            recibe: recibe(),
    };
    const { roommates } = JSON.parse(fs.readFileSync("roommates.json", "utf-8"));
    roommates.push(roommate);

    fs.writeFileSync("roommates.json", JSON.stringify({ roommates }));
    return roommates;
    } catch {
        res.status(500).send("Algo salio mal") 
    }
}

const recibe = () => {
    try {
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf-8"));
        let cantidadTotal = 0;

        for (const gasto of gastosJSON.gastos) {
            cantidadTotal += gasto.monto;
        }
        return cantidadTotal;
    } catch (error) {
        console.error("Algo salió mal:", error.message);
    }
}

const debe = (cantidadTotal) => {
    try {
        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf-8"));
        const cantRoommates = gastosJSON.gastos.length;
        const result = cantidadTotal / cantRoommates;
        return result;
    } catch (error) {
        console.error("Algo salió mal:", error.message);
    }
}

module.exports = { getroommate};
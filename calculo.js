const { v4: uuid } = require('uuid');
const fs = require("fs");

let updateDebeRecibe = async (id, monto) => {
    try {
        const { roommates } = JSON.parse(fs.readFileSync("roommates.json", "utf-8"));
        let cantidadRoommates = roommates.length;
        let montoDivTotal = monto / cantidadRoommates;

        for (let roommate of roommates) {
            roommate.debe = Math.round(montoDivTotal);

        }

        fs.writeFileSync("roommates.json", JSON.stringify({ roommates }));
    } catch (error) {
        console.error("Algo salió mal:", error.message);
    }
}

module.exports = { updateDebeRecibe };

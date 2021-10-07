import main from "./absen/absen.js";
import express from "express";
const app = express();

app.get("/", (req, res) => {
    const npm = req.query.npm;
    const password = req.query.password;
    let resAbsen = "";
    
    (async () => {
        resAbsen = await main(npm, password);
        res.send({
            npm: npm,
            password: password,
            result: resAbsen
        });
    })();

});

app.listen(80);

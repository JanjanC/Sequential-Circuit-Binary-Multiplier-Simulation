const express = require(`express`);
const path = require("path");

const app = express();

port = 8080;
hostname = "localhost";

app.use(express.static(path.join(__dirname)));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/index.html"));
});

app.listen(port, hostname, function () {
    console.log(`Server running at:`);
    console.log(`http://` + hostname + `:` + port);
});

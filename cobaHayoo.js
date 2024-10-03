// core module
const os = require("os")
const fs = require("fs")

// local module
const luasSegitiga = require("./luasSegitiga");
const user = os.userInfo()

console.log('current user:', user.username);
console.log('free memmory:', Math.round(os.freemem() / 1000000000), "GB");
console.log("luas segitiga:", luasSegitiga(2, 10));

fs.writeFileSync("text.txt", JSON.stringify(user))

const data = JSON.parse(fs.readFileSync("text.txt", "utf-8"));
console.log(data);

const http = require('http')
const path = require("path")
const fs = require("fs")

const itemsDBPath = path.join(__dirname, "db", 'items.json');

const PORT = 8000
const HOST_NAME = 'localhost';



function requestHandler(req, res) {

    if (req.url === '/items' && req.method === "GET") { //READ
        // LOAD AND RETURN BOOKS
        getAllItem(req, res)
    } else if (req.url === '/items' && req.method === "POST") { // Create
        addItem(req, res)
    } else if (req.url === '/items/:id' && req.method === "PUT") { // Update
        updateItem(req, res)
    } else if (req.url === '/items/:id' && req.method === "DELETE") {
        deleteItem(req, res)
    } else if (req.url === '/items/:id' && req.method === "GET") {
        getOneItem(req, res)
    }
}

function addItem(req, res) {
    const body = []

    req.on("data", (chunk) => {
        body.push(chunk)
    })

    req.on("end", () => {
        const parsedItem = Buffer.concat(body).toString()
        const newItem = JSON.parse(parsedItem)

    fs.readFile(itemsDBPath, "utf8", (err, data) => {
        if(err) {
            console.log(err);
            res.writeHead(400)
            res.end("An error occured")
        }

        const oldItems = JSON.parse(data)
        const allItems = [...oldItems, newItem]

        fs.writeFile(itemsDBPath, JSON.stringify(allItems), (err) => {
            if(err) {
                console.log(err);
                res.writeHead(500)
                res.end(JSON.stringify({
                    message: 'Internal server error'
                }));
            }

            res.end(JSON.stringify(newItem));
        })
    })
 })
}

function getAllItem(req, res) {
    fs.readFile(itemsDBPath, "utf8", (err, data) => {
        if (err) {
            console.log(err)
            res.writeHead(400)
            res.end("An error occured")
        }

        res.end(data)
    })
}

function getOneItem(req, res) {
    fs.readFile(itemsDBPath, "utf8", (err, data) => {
        if (err) {
            console.log(err)
            res.writeHead(400)
            res.end("An error occured")
        }

        res.end(data)
    })
}

function updateItem(req, res) {
    const body = []

    req.on("data", (chunk) => {
        body.push(chunk)
    })

    req.on("end", () => {
        const parsedItem = Buffer.concat(body).toString()
        const detailsToUpdate = JSON.parse(parsedItem)
        const itemId = detailsToUpdate.id

        fs.readFile(itemsDBPath, "utf8", (err, items) => {
            if (err) {
                console.log(err)
                res.writeHead(400)
                res.end("An error occured")
            }

            const itemsObj = JSON.parse(items)

            const itemIndex = itemsObj.findIndex(item => item.id === itemId)

            if (itemIndex === -1) {
                res.writeHead(404)
                res.end("Item with the specified id not found!")
                return
            }

            const updatedItem = { ...itemsObj[itemIndex], ...detailsToUpdate }
            itemsObj[itemIndex] = updatedItem

            fs.writeFile(itemsDBPath, JSON.stringify(itemsObj), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save Item to database.'
                    }));
                }

                res.writeHead(200)
                res.end("Update successfull!");
            });

        })

    })
}


function deleteItem(req, res) {
    const body = []

    req.on("data", (chunk) => {
        body.push(chunk)
    })

    req.on("end", () => {
        const parsedItem = Buffer.concat(body).toString()
        const detailsToUpdate = JSON.parse(parsedItem)
        const itemId = detailsToUpdate.id

        fs.readFile(itemsDBPath, "utf8", (err, items) => {
            if (err) {
                console.log(err)
                res.writeHead(400)
                res.end("An error occured")
            }

            const itemsObj = JSON.parse(items)

            const itemIndex = itemsObj.findIndex(item => item.id === itemId)

            if (itemIndex === -1) {
                res.writeHead(404)
                res.end("Item with the specified id not found!")
                return
            }

            // DELETE FUNCTION
            itemsObj.splice(itemIndex, 1)

            fs.writeFile(itemsDBPath, JSON.stringify(itemsObj), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save item to database.'
                    }));
                }

                res.writeHead(200)
                res.end("Deletion successfull!");
            });

        })

    })
}






const server = http.createServer(requestHandler)

server.listen(PORT, HOST_NAME, () => {
    itemsDB = JSON.parse(fs.readFileSync(itemsDBPath, 'utf8'));
    console.log(`Server running at http://${HOST_NAME}:${PORT}`);
})
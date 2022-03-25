import fs from "fs";
import http, { IncomingMessage, Server, ServerResponse } from "http";

let database = "database.json";

const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
  switch (req.method) {
    case "GET":
      getCustomers(req, res);
      break;

    case "POST":
      addCustomer(req, res);
      break;

    case "PUT":
      updateCustomer(req, res);
      break;

    case "DELETE":
      deleteCustomer(req, res);
      break;

    default:
      invalidRequest(req, res);
  }

});

server.listen(3005, () => console.log("Server is now running on port 3005"));


function getCustomers(req: IncomingMessage, res: ServerResponse) {
  const readableStream = fs.createReadStream(database, "utf8");

  readableStream.on("error", (err) => {
    // handle error if database.json does not exist
    res.writeHead(404, { "Content-type": "text/plain" });
    res.end(JSON.stringify("No data available."));
  });

  readableStream.on("data", (customers) => {
    // return list of customers in database.json
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(customers);
  });

  return;
}


function addCustomer(req: IncomingMessage, res: ServerResponse) {
  let input: string[] | any = [];

  req.on("data", (data) => {
    input.push(data);
  });

  req.on("end", () => {
    // Test the if the database.json file exists
    fs.access(database, fs.constants.F_OK, (err) => {
      if (err) {
        // If file doesn't exist, create the file
        fs.writeFileSync(database, "[]");
      }

      // Read content of database.json file and append input
      let fileData: string[] | any = fs.readFileSync(database, "utf8");
      fileData = JSON.parse(fileData);
      input = JSON.parse(input);

      const timeStamp = new Date();
      let id = fileData.length ? fileData[fileData.length - 1]["customerId"] + 1 : 1;
      input["customerId"] = id;
      input["createdAt"] = timeStamp;
      input["updatedAt"] = timeStamp;

      fileData.push(input);

      // Write appended content to database.json file
      const output = JSON.stringify(fileData, null, 2);
      // fs.writeFileSync(database, output);
      const writeStream = fs.createWriteStream(database, {
        flags: "w",
        encoding: "utf8",
      });
      writeStream.write(output);
      res.end(JSON.stringify(`Customer added successfully. Your customerID is ${id}`));
    });
  });

  return;
}


function updateCustomer(req: IncomingMessage, res: ServerResponse) {
  let input: string[] | any = [];

  req.on("data", (data) => {
    input.push(data);
  });

  req.on("end", () => {
    // Test the if the database.json file exists
    fs.access(database, fs.constants.F_OK, (err) => {
      if (err) {
        // If file doesn't exist, return "No data available" error
        res.writeHead(404, { "Content-type": "text/plain" });
        res.end(JSON.stringify("No data available."));
      }

      // Read content of database.json file
      let fileData: string[] | any = fs.readFileSync(database, "utf8");
      fileData = JSON.parse(fileData);
      input = JSON.parse(input);

      // Search for and update customer data with matching id
      for (let i = 0; i < fileData.length; i++) {
        if (fileData[i]["customerId"] === input["customerId"]) {
          fileData[i]["name"] = input["name"];
          fileData[i]["updatedAt"] = new Date();

          // Write updated content to database.json file
          const output = JSON.stringify(fileData, null, 2);
          const writeStream = fs.createWriteStream(database, {flags: "w", encoding: "utf8"});
          writeStream.write(output);
          res.writeHead(200, { "Content-type": "text/plain" });
          res.end(JSON.stringify("Customer details updated."));
          return;
        }
      }

      // If no matching id is found, return ID not found error
      res.writeHead(404, { "Content-type": "text/plain" });
      res.end(JSON.stringify("ID not found."));
    });
  });

  return;
}


function deleteCustomer(req: IncomingMessage, res: ServerResponse) {
  let input: string[] | any = [];

  req.on("data", (data) => {
    input.push(data);
  });

  req.on("end", () => {
    // Test the if the database.json file exists
    fs.access(database, fs.constants.F_OK, (err) => {
      if (err) {
        // If file doesn't exist, return ID not found error
        res.writeHead(404, { "Content-type": "text/plain" });
        res.end(JSON.stringify("No data available."));
      }

      // Read content of database.json file
      let fileData: string[] | any = fs.readFileSync(database, "utf8");
      fileData = JSON.parse(fileData);
      input = JSON.parse(input);

      // Search for and delete customer data with matching id
      for (let i = 0; i < fileData.length; i++) {
        if (fileData[i]["customerId"] === input["customerId"]) {
          fileData.splice(i, 1);

          // Write updated content to database.json file
          const output = JSON.stringify(fileData, null, 2);
          const writeStream = fs.createWriteStream(database, {flags: "w", encoding: "utf8"});
          writeStream.write(output);
          res.writeHead(200, { "Content-type": "text/plain" });
          res.end(JSON.stringify("Customer deleted."));
          return;
        }
      }

      // If no matching id is found, return ID not found error
      res.writeHead(404, { "Content-type": "text/plain" });
      res.end(JSON.stringify("ID not found."));
    });
  });

  return;
}


function invalidRequest(req: IncomingMessage, res: ServerResponse) {
  res.writeHead(404, { "Content-type": "text/plain" });
  res.end("Invalid request method.");
  return;
}
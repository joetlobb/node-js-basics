const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Send</button></form></body>"
    );
    res.write("</html>");
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk); // log = <Buffer 6d 65 73 73 61 67 65 3d 6a 6f 65 74 6c 6f 62 62>
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody); // log = message=joetlobb
      const message = parsedBody.split("=")[1];
      // fs.writeFileSync("message.txt", message);

      // write file with extracted message * but this is a synchronous which block code execution
      // use writeFile which is an async instead
      fs.writeFile("message.txt", message, (err) => {
        // handle error, return error message to users

        // response logic move in here because response should be sent when we finish write the file
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My First Page</title></head>");
  res.write("<body><h1>Hello from Node.js Server!</h1></body>");
  res.write("</html>");
  res.end();
};

// module.exports = requestHandler;
module.exports = {
  handler: requestHandler,
  someText: "Some hard code text",
};

// same as obj export above
// module.exports.handler = requestHandler;
// module.exports.someText = "Some hard code text";

// shortcuts syntax export
// exports.handler = requestHandler;
// exports.someText = "Some hard code text";

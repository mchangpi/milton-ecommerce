const fs = require("fs");

const requestHandler = (req, resp) => {
  const url = req.url;
  const method = req.method;
  console.log("url ", url);
  console.log("method ", method);
  if (url === "/") {
    resp.setHeader("Content-Type", "text/html");
    resp.write(
      `<form action="/message" method="POST">
				<input type="text" name="message"/>
				<input type="submit" value="Submit">
			</form>`
    );
    return resp.end();
  } else if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    req.on("end", () => {
      const parseBody = Buffer.concat(body).toString();
      console.log(parseBody);
      const msg = parseBody.split("=")[1];
      fs.writeFile("msg.text", msg, (err) => {
        resp.statusCode = 302;
        resp.setHeader("Location", "/");
        return resp.end();
      });
    });
  }
};

module.exports = { requestHandler };

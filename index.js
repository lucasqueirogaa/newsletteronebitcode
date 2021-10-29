const express = require("express");
const app = express();
const handleBars = require("express-handlebars");
const Client = require("pg").Client;
const client = new Client({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: "5432",
  database: "newsletter",
});

// =========== Config ===========

app.engine("handlebars", handleBars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extend: true }));
app.use(express.json());
const favicon = require("serve-favicon");
app.use(favicon(`${__dirname}/assets/rubyLogo.png`));
app.use(express.static("views/images"));
app.use("/assets", express.static("assets"));

// ========= Rotas =========

// ---> Inicio e registro do email
app.get("/", (req, res) => {
  res.render("registros");
});

// ---> Redirecionar para aqui quando finalizado!
app.get("/show", (req, res) => {
  res.render("show");
});

// ---> Fazer a adição do email e redirecionar

app.post("/addEmail", (req, res) => {
  setEmails(req.body.emailCamp).then(() => {
    res.redirect("/show");
  });
});

// ========= Função add in DB =========

async function setEmails(email) {
  try {
    console.log("Iniciando a conexão");
    await client.connect();
    console.log("Conexão bem sucessedida!");
    await client.query(`insert into emails("email") values ('${email}')`);

    const resultado = await client.query("select * from emails");
    console.table(resultado.rows);
  } catch (error) {
    console.log(`Foi encontrado um error carFunc: ${error}`);
  } finally {
    await client.end();
    console.log("Client disconectado.");
  }
}

// Listen app
app.listen(3000);
console.log("Server runing in port 3000");

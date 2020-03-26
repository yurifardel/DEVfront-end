 // installar um servidor - npm install express e npm install nodemon
 // nodemon monitora a aplicação inteira (npm start)
 // npm install nunjucks - ferramenta que permite que o uso de variaveis e funcionalidades dentro do HTML
// npm install pg - resposavel pela conexão com o banco de dados



// config o servidor
 const express = require("express")
 const server = express()

 // config o serv para apresentar arquivos estaticos
 server.use(express.static('public'))


// habilitar body do formulario
 server.use(express.urlencoded({ extended: true}))


// configura a conexão com o banco de dados
 const Pool = require('pg').Pool
 const db = new Pool({
     user: 'postgres',
     password: '0000',
     host: 'localhost',
     port: 5432,
     database: 'hackadevs'
 })


//config a template engine
 const nunjucks = require("nunjucks")
 nunjucks.configure("./", {
     express: server,
     noCache: true,
 })


server.post("/", function(req, resp) {
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood


    if (name == "" || email == "" || blood == "") {
        return resp.send("Todos os campos são obrigatórios.")
    }



    // coloca valores dentro do banco de dados
    const query = `
        INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err){
        // fluxo de erros
        if (err) return resp.send("erro no banco de dados.")

        // fluxo real
        return resp.redirect("/")

    } )

    
})


 // configurar a apresentação da pagina
 server.get("/", function(req, resp){
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return resp.send("erro de banco de dados!")


        const donors = result.rows
        return resp.render("index.html", { donors })


    })
    
    
    
    
 })



 // ligar o servidor e permitir o acesso na porta 3000

 server.listen(3000, function() {
     console.log("iniciei o servidor")
 })


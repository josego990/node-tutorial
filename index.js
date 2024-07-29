var express = require("express");
var app = express();
const http = require("http");
var bodyParser = require("body-parser");
var mssql = require("mssql");

const sql_name = "database-1.cb286cy4czi4.us-east-1.rds.amazonaws.com";

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // aquí podemos permitir ciertas IP's
    res.header("Access-Control-Allow-Headers", "*");
    next();
  });
//METODO GET DE PRUEBA
app.get("/prueba-api-get", (req, res) => {
  const jsonResponse = {
    message: "API Respondiendo Correctamente...",
  };

  res.status(200).json(jsonResponse);
});

//METODO LOGIN 
app.post("/prueba-login-post", (req, res) => {

    //res.setHeader("Access-Control-Allow-Origin", "*");

    console.log(req.body);
    let access = false;
    let msg = 'Usuario o Contraseña Incorrecta';

    var sql = require("mssql");

    var config = {
        user: "admin",
        password: "catarsys",
        server: sql_name,
        database: "app_angular",
        port: 1433,
        options: {
        trustServerCertificate: true,
        },
    };
    sql.close();

    var query = "exec proc_validate_user '" + req.body.usr + "','" + req.body.pass + "'" ;

    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
    
        request.query(query, function (err, recordset) {
          if (err) {
            console.log(err);
            res.status(503).send("error al procesar el archivo: ");
          }
          // send records as a response
          sql.close();
          console.log(recordset.recordset[0].RESULT);
          if(parseInt(recordset.recordset[0].RESULT) > 0){
            console.log('ENTRA..');
            
            const jsonResponse = {
                message: {
                access:true,
                msg:msg
                },
            };            
            res.status(200).json(jsonResponse);
          }
          else{
            const jsonResponse = {
                message: {
                access:false,
                msg:msg
                },
            };
            
            res.status(200).json(jsonResponse);
          }
        });
      });

});


const PORT_3030 = 3030;
const server = http.createServer(app);

server.listen(PORT_3030, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT_3030}`);
});

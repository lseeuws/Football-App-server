import express from "express";
import cors from "cors";
import pool from './db';
import bodyParser from "body-parser";
import { loginValidation } from "./validation";

const app = express();
const router = express.Router();
const jwt = require('jsonwebtoken');
const session=require('express-session');
const passport=require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator')
const User = require('../models/User');
var path = require('path');



app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUnitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

var hash=require('pbkdf2-password')();


app.get("/get_joueur", async (req, res) => {
try {
    const client = await pool.connect();
    const rows = await client.query("SELECT * from joueur");
    console.log(rows);
    res.send(rows.rows);
    client.release();
} catch (err) {
    res.status(500);
    console.error(err);
    console.log("cgryever")
}
});

app.get("/get_login",loginValidation,async (req,res,next)=>{
    try {
        const client = await pool.connect();
        pool.query('SELECT * FROM user WHERE email='+pool.escape(req.body.email)+';'),
        (err, result)=>{
            if(err){
                throw err;
                return res.status(400).send({
                    msg:err
                });
            }
            if(!result.length){
                return res.status(401).send({msg:'Email or password is incorrect'});
            }

            bcrypt.compare(req.body.password),result[0]['password'],(bErr,bResult)=>{
                //wrong password
                if(bErr){
                    return res.status(401).send({msg:'Email or password is incorrect'});
                }
                if(bResult){
                    const token = jwt.sign({id:result[0].id},'the-super-strong-secrect',{ expiresIn: '1h' });
                    return res.status(200).send({
                    msg: 'Logged in!',
                    token,
                    user: result[0]
                    });
                    }
                    
                    return res.status(401).send({msg:'Email or password is incorrect'});
                }

            }
            client.release();
    }
        //res.send(rows.rows);
    catch (err) {
        res.status(500);
        console.error(err);
        console.log("cgryever")
    }
})

app.post("/post_joueur", async (req, res) => {
try {
    console.log(req.body);
    const data = req.body;
    console.log(data);
    res.status(200).send("Data received successfully!");
} catch (err) {
    console.log("Error:");
    res.status(400).send("Error receiving data.");
}
});

app.listen(5000, () => console.log("Serveur démarré"));

app.use(session({
    secret:'leSecret',
    resave: false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    (username,password,done)=>{
        if(username === ''&& password ===''){
            return done(null,{id:1, username:'john'});
        } else{
            return done(null,false);
        }
    }
))



passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    /*User.findById(id, (err, user) => {
        done(err, user);
      });*/
      const user={id:1, username:"john"};
});





// app.use("/test_static", express.static("public"));

// app.get("/", (req : any, res: any) => res.send("Hello"));


// app.get("/test", (req : any, res :any) => {
//     res.send(`<img src="/test_static/rondoudou.gif" >`);
// });

// app.post("/test", (req : any, res : any) => {
//     res.send("hello post");
// });

// app.put("/test", (req : any, res : any) => {
//     res.send({"message": "Ceci est une réponse d'un PUT"});
// });

// app.delete("/test", (req : any, res : any) => {
//     res.send("aie ça fais mal de delete");
// });



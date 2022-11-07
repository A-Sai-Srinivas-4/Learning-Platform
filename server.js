const express = require('express');
const mongoose = require('mongoose');
const Registeruser = require('./model');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware');
const cors = require('cors')
const app = express();

mongoose.connect("mongodb+srv://saisrinivas:ajay1234@cluster0.2o2sms2.mongodb.net/?retryWrites=true&w=majority").then(
    () => console.log("DB Connected....")
)


app.use(express.json());

app.use(cors({origin:"*"}));

app.post('/signup',async (req,res) => {
    try{
        const {username,email,password,confirmpassword} = req.body;
        const exist = await Registeruser.findOne({email : email})
        if(exist){
            return res.status(400).send('User Already Exist')
        }
        if(password !== confirmpassword){
            return res.status(400).send("Passwords are not matching");
        }
        let newUser = new Registeruser({
            username,
            email,
            password,
            confirmpassword
        })
        await newUser.save();
        return res.status(200).send('Registered Successfully')
    }
    catch(err){
        console.log(err)
        return res.status(500).send("Internal Server Error")
    }
})



app.post("/signin", async (req,res) => {
    try {
        const {email,password} = req.body;
        const exist = await Registeruser.findOne({email});
        if(!exist) {
            return res.status(400).send("User not Found");
        }
        if (exist.password !== password) {
            return res.status(400).send("invalid credentials");
        }
        let payload = {
            user:{
                id : exist.id
            }
        }
        jwt.sign(payload,"jwtPassword",{expiresIn:3600000},
            (err,token) => {
                if (err) throw err;
                return res.json({token})
            }
            )
        
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error")
    }
})

app.get('/home',middleware,async(req,res) => {
    try {
        const exist = await  Registeruser.findById(req.user.id)
        if (!exist){
            return res.status(400).send("User not found");
        }        
        res.json(exist);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error")
    }
})

app.get('/myprofile',middleware,async(req,res) => {
    try {
        const exist = await  Registeruser.findById(req.user.id)       
        return res.json(exist);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error")
    }
})

app.get('/react',middleware,async(req,res) => {
    try {
        const exist = await  Registeruser.findById(req.user.id)
        if (!exist){
            return res.status(400).send("User not found");
        }        
        res.json(exist);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error")
    }
})


app.listen(5000, () => {
    console.log('server running....')
})


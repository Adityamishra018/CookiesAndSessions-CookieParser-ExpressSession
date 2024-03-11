import express from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import Jwt from "jsonwebtoken"

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser("MaGIcSTRinG"))

app.get("/login",(req,res)=>{
    res.send(`
    <form method="post" action="/login">
        Username : <input name="username" type="text" /></br>
        Password : <input name="password" type="password" /></br>
        <button>Submit</button>
    </form>
    <a href="/restricted">Go to protected route</a>
    `);
})

app.post("/login",(req,res)=>{
    if(req.body.username === "user" && req.body.password === "pwd"){
        let token = Jwt.sign({user:"user",name:"Aditya"},"seCretKey")
        res.cookie("jwt",token,{httpOnly : true})
        res.redirect("/restricted");
    }
})


app.post("/logout",(req,res)=>{
    res.clearCookie("jwt")
    res.redirect("/login")
})


app.get("/restricted",(req,res)=>{

    if(req.cookies.jwt){
        let token = req.cookies.jwt
        let user = Jwt.verify(token,"seCretKey")
        res.send(`
            <h1>Hello ${user.name}</h1>
            <form method="POST" action="/logout">
                <button>Logout Now</button>
            </form>
        `)
    }
    else{
        res.redirect('/login')
    }
})


app.listen(3000)
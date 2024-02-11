import express from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser("MaGIcSTRinG"))

app.get("/index",(req,res)=>{
    res.send(`
    <form method="post" action="/index">
        Username : <input name="username" type="text" /></br>
        Password : <input name="password" type="password" /></br>
        <button>Submit</button>
    </form>
    `);
})

app.post("/index",(req,res)=>{
    if(req.body.username === "user" && req.body.password === "pass"){
        res.cookie("msg","Way easier with cookie-parser than doing it manually, isn't it?",{
            maxAge : 1000*60*1,
            httpOnly : true
        })
        res.redirect("/restricted");
    }
    else{
        res.redirect("/index")
    }
})

app.get("/restricted",(req,res)=>{
    if(req.cookies.msg){
        res.send(`
            <h1>Msg stored in cookie : "${req.cookies.msg}"</h1>
            <h2>You can access this for 1 min or you can clear it now</h2>
            <form method="POST" action="/clear">
                <button>Clear Cookie Now</button>
            </form>
        `)
    }
    else{
        res.redirect("/index");
    }
})

app.post("/clear",(req,res)=>{
    res.clearCookie("msg")
    res.redirect("/index")
})

app.listen(3000)
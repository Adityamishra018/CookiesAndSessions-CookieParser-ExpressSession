import express from "express"
import session from "express-session"
import bodyParser from "body-parser"

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(session({
    secret : "MagicStrinG",
    saveUninitialized: false,
    resave : false,
    rolling : true,
    cookie : {
        // maxAge : 1000*60*1,
        httpOnly: true,
        secure : false
    }
}))

function isAuthenticated(req,res,next){
    //Check a property that you set on session, because session by itself will always be defined
    if(req.session.user)
        next()

    else
        res.redirect("/")
}

app.get("/",(req,res)=>{
    res.send(`
    <form method="post" action="/">
        Username : <input name="username" type="text" /></br>
        Password : <input name="password" type="password" /></br>
        <button>Submit</button>
    </form>
    <a href="/homepage">Go to protected route</a>
    `);
})

app.post("/",(req,res,next)=>{
    //generate session for this user (using cookies internally)
    req.session.regenerate((err)=>{
        if (!err)
            req.session.user = req.body.username
    })

    //save session in session-store, similar to how you'd store in any db
    //since by default this is in memory store, if you restart server the session info will be lost
    req.session.save((err)=>{
        if(err)
            next(err)
        
        res.redirect("/homepage");
    })
})

app.get("/homepage",isAuthenticated,(req,res)=>{
    res.send(`
        <h1>Hello ${req.session.user}</h1>
        <h2>Session running in rolling fashion</h2>
        <a href="/logout">End Session Now</a>
    `)
})


app.get("/logout",(req,res)=>{
    //removes session from store then calls the callback
    req.session.destroy((err)=>{
        if(err)
            next(err)
        res.redirect("/")
    })
})

app.listen(3000)


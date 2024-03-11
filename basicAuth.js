import express from "express"

const app = express()

app.get("/restricted",(req,res)=>{

    if(!req.header('Authorization'))
        return res.header('www-authenticate','Basic realm="auth only"').status(401).send()

    let encodedCreds = req.header('Authorization').split(" ")[1]
    let [user, pwd] = atob(encodedCreds).split(":")
    if (user === "user" && pwd === "pwd"){
        res.send(`
            <h1> Hi there User </h1>
            <p> you can access this page now as long as you don't close the browser </p>
        `)
    }
    else{
        return res.header('www-authenticate','Basic realm="auth only"').status(401).send()
    }
})


app.listen(3000)
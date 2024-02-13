import express from "express"

let app = express()

app.use((req,res,next)=>{
    if(req.get('authorization')){
        let creds64 = req.get('authorization').split(' ')[1]
        let creds = Buffer.from(creds64,'base64').toString('utf-8').split(':')
        if(creds[0] === 'root' && creds[1] === 'root')
            return next()
    }
    res.set('www-authenticate', 'Basic realm="Admin only"');
    res.status(401).send()
})

app.get('/protected',(req,res)=>{
    console.log("got to protected")
    res.send('Hello')
})

app.listen(3000)

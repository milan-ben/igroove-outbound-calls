require("dotenv").config()
const express = require("express")
const cors = require("cors")
const twilio = require("twilio")

const PORT = 3000

const app = express()
app.use(cors())
app.use(express.json())

const AccessToken = twilio.jwt.AccessToken
const VoiceGrant = AccessToken.VoiceGrant

app.get("/", (req, res) => {
    res.send("This is an API enpoint.")
})

app.get("/token", (req, res) => {
    const identity = "browser-user"

    const voiceGrant = new VoiceGrant({
        outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID
    })

    const token = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET,
        { identity }
    )

    token.addGrant(voiceGrant)

    res.send({ token: token.toJwt() })
})

app.post("/twiml", (req, res) => {
    const VoiceResponse = twilio.twiml.VoiceResponse
    const response = new VoiceResponse()

    const dial = response.dial( {
        callerId: process.env.TWILIO_NUMBER
    })
    
    dial.number(req.body.to)

    res.type("text/xml")
    res.send(response.toString())
})

app.listen(PORT, () => console.log("Server is running on port:", PORT))
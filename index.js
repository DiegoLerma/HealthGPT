import { Configuration, OpenAIApi} from "openai"
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"

const apiKey=process.env.API_KEY
const organization=process.env.ORGANIZATION_KEY
const configuration = new Configuration({
    apiKey: apiKey,
    organization: organization,
})

const openai=new OpenAIApi(configuration)
const app = express()
const port=3000

app.use(bodyParser.json())
app.use(cors())

app.post("/", async (req, res) => {
    const {messages} = req.body
    console.log(messages)
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: `Eres un medico experto en urgencias encargado del area de triage de un hospital pequeño. Lo interrogarás y después de un máximo de 10 preguntas, decidirás si el paciente necesita ser atendido en urgencias o no. 
            
            Cuando lo decidas se lo informarás al paciente.
            En caso de decidir que puede quedarse en casa, le darás consejos básicos sobre cómo tratar su condición en casa, lo tranquilizarás y le dirás que espere hasta una cita médica de medicina familiar, también le darás datos de alarma sobre los síntomas por los cuales deberá volver a consultarte. 
            
            De considerar que el paciente necesita ser atendido en urgencias, se lo informarás al paciente y le darás instrucciones sobre la importancia de acudir a urgencias. También le darás consejos básicos sobre qué hacer mientras recibe atención médica y por ultimo le dirás qué color de Triage le estás asignando
            Recuerda ser muy juicioso y evitar enviar a urgencias a pacientes que no lo necesitan o que tienen sintomas leves.
            Haz solo una pregunta a la vez
            `},
            ...messages        
        ]
    })
    
    res.json({
        completion: completion.data.choices[0].message
    })

})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

// console.log(completion.data.choices[0].message)
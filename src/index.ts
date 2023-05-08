
import   express from 'express';
import bodyParser  from 'body-parser';
import cors from 'cors';
import { router } from "./router/upload.router";
const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
const port :number =4300



app.use('/',router)



app.listen(port,():void =>{
    console.log(`server is running localhost:${port}`)
})


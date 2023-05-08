import { Request, Response } from 'express';
import multer from 'MULTER';
import path from 'path';
import { tmpdir } from 'os';
import { spawn } from "child_process";
import { v4 as uuid } from 'uuid';
import fs from 'fs'




// enum readFile {
//     TINY='tiny',
//     BASE='base',
//     SMALL='small',
//     MEDIUM ='medium',
//     LARGE ='large',
// }



//FILE UPLOAD 

const storage = multer.diskStorage({
    destination: path.join(tmpdir(), uuid()),
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

export const upload = multer({ storage: storage }).single('file')



//MP3 FILE OR MP4 FILE READ API

export const fileRead = async (req: Request, res: Response): Promise<void> => {
    console.log("api call get")
    const namefile: string = req.file.filename
    const model: string = req.body.model
    const language: string = req.body.language
    const translationtype: boolean = req.body.translationtype
    const directry: string = req.file.destination
    const filePath: string = path.join(directry, namefile)
    console.log(namefile,model,language,translationtype)
    function execute(): Promise<string> {

        let logicArray: string[] = [filePath]
        if (model) {
            logicArray.push("--model", model)
        }
        if (language) {
            logicArray.push("--language", language)
        }
        if (translationtype) {
            logicArray.push("--task", "translate")
        }
        console.log(logicArray)
        const outdata = spawn("whisper", logicArray, { cwd: directry });


        return new Promise((resolve, reject) => {
            let error: any;
            outdata.on('error', (errorout: any) => error = errorout);
            outdata.on("close", (code: number) => {
                if (code === 0) {
                    const pathUseRead = path.basename(filePath, path.extname(filePath))
                    const resultNew = path.join(path.dirname(filePath), pathUseRead + '.txt')
                    const readData = fs.readFileSync(resultNew)
                    // fs.rmdir(path.join(directry), (err) => { console.log(err) });
                    resolve(readData.toString())
                    return
                }
                reject(error?.message || 'Error  in whisper....')
            });

        })
    }
    try {
        const result = await execute()
        res.status(200).send({ message: result })
    } catch (error: any) {
        res.status(500).send(error.message)
    }

}
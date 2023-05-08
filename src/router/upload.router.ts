import { Router } from 'express';
import { fileRead, upload } from '../controller/userfileupload';

export const router = Router()

router.post('/fileupload',upload, fileRead)

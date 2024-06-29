import { Router } from 'express';
import {getCodeBlocksTitles, getCodeBlockById, getCodeBlockByTitle} from '../controllers/codeBlockController';

const router: Router = Router();

router.get('/', getCodeBlocksTitles);
router.get('/id/:id', getCodeBlockById);
router.get('/title/:title', getCodeBlockByTitle);

export default router;
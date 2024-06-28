import { Router } from 'express';
import { getCodeBlocksTitles, getCodeBlockById } from '../controllers/codeBlockController';

const router: Router = Router();

router.get('/', getCodeBlocksTitles);
router.get('/:id', getCodeBlockById);

export default router;
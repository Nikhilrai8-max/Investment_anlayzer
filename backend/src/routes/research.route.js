import express from 'express';
import { analyzeCompany, exportMemo } from '../controllers/research.controller.js';

const router = express.Router();

router.post('/analyze', analyzeCompany);
router.post('/export', exportMemo);

export default router;

import express from 'express';

import faces from './faces';
import login from './login';
import auth from './auth';
import init from './init';
import scrap from './scrap';

const router = express.Router();

router.use('/api/faces', faces);
router.use('/login', login);
router.use('/auth', auth);
router.use('/init', init);
router.use('/scrap', scrap);

export default router;

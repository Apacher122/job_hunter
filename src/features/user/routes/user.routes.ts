import { getUser, newUser } from '../controllers/user.controller';
import express from 'express';

const router = express.Router();
router.post('/create-user', newUser);
router.get('/get-user-info', getUser);
router.put('/update-user-info');
export default router;

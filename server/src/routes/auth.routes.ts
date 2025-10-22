import express from 'express'
import { body } from 'express-validator'
import { login, register } from '../controllers/auth.controller';

const router = express.Router()

router.post("/register",
    body("email").isEmail().withMessage("Provie valid Input"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
    register
)
router.post("/login",
    body("email").isEmail().withMessage("Provie valid Input"),
    body("password").exists(),
    login
)
export default router

import express from 'express'
import { acceptInvitation } from './invitationControllers'

const router = express.Router()

router.post('/accept', acceptInvitation)

export default router

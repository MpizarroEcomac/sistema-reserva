import { Router } from 'express'

const router = Router()

// Placeholder routes - will be implemented in next phase
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint - to be implemented' })
})

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout endpoint - to be implemented' })
})

router.get('/me', (req, res) => {
  res.json({ message: 'User profile endpoint - to be implemented' })
})

export default router
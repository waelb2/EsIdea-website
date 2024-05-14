import express, { Router, Request, Response } from "express"

// Create a router instance
const router: Router = express.Router()

// Define a route to handle GET requests to '/profile'
router.get('/profile', (req: Request, res: Response) => {
     // Send back the query parameters received in the request
     res.send(req.query)
})

// Export the router for use in other parts of the application
export = router

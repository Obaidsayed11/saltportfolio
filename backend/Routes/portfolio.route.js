import { Router} from "express"

import { getPortfolioData} from '../Controllers/portfolio.controller.js'

const router = Router()
router.get('/', getPortfolioData);


export default router;

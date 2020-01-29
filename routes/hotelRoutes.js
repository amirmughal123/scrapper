import express from 'express';
import scrapperController from '../controllers/scrapper';
const router = express.Router(); //-- creating router
const {
  scrape,
  getByCountry
} = scrapperController;

//============================= BASE CALLS
router.route('/')
  // POST /users
  .get(scrape)

// router.route('/:country')
//   .get(getByCountry)

export default router;

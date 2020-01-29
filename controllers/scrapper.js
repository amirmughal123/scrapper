import Hotel from '../models/hotelModal';

import fs from 'fs';
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
let bookingUrl = 'https://www.realtor.com/realestateandhomes-search/Punta-Gorda_FL';

const scrape = async (req, res, next) => {
  try {
    const args = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
      '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
    ];

    const options = {
      args,
      headless: false,
      ignoreHTTPSErrors: true,
      // userDataDir: './tmp'
    };
    const browser = await puppeteer.launch(options);

    const preloadFile = fs.readFileSync('../utils/preload.js', 'utf8');
      const page = await browser.newPage();
      await page.evaluateOnNewDocument(preloadFile);
      
      await page.setViewport({ width: 1920, height: 1200 });
      await page.goto(bookingUrl, { waitUntil: 'networkidle2' });
      const jsHandle = await page.evaluate(() => {
        var hotels = [];
        const elements = document.querySelectorAll('.js-quick-view');
        elements.forEach((hotelelement) => {
          let hotelJson = {};
          try {
            hotelJson.imageUrl = hotelelement.querySelector('li.div.photo-wrap').innerText;
            hotelJson.price = hotelelement.querySelector('li.div.div.data-price').innerText;
            hotelJson.area = hotelelement.querySelector('li.ul.li.data-value').innerText;
            hotelelement.propertyType = hotelelement.querySelector('li.div.photo-overlay.photo-overlay-details.property-type').innerText;
            hotelelement.location = 'Lahore_VA';
          }
          catch (exception){

          }
          hotels.push(hotelJson);
        })
        return hotels;
      });

      for(const element of jsHandle) {
        await Hotel.create({ element });
      }

      return res.send('SCRPPED SUCCESSFULLY !!!');

  } catch (error) {
    next(error);
  }
}

const getByCountry = async (req, res, next) => {
  try {

      const {country} = req.params;

      const hotels = await Hotel.find({ location: country });

      return res.send(hotels);

  } catch (err) {
    next(err);
  }
}

export default {
  scrape,
  getByCountry
};

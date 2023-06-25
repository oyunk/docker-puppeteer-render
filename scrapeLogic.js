const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {
    // res.send("Hello from scrapeLogic!");


    //2023-06-21: https://stackoverflow.com/questions/64117723/puppeteer-failed-to-launch-the-browser-process-spawn
    //to locate where chromium/chrome browser is
    // const locateChrome = require('locate-chrome');
    // const executablePath = await new Promise(resolve => locateChrome(arg => resolve(arg)));
    // const browser = await puppeteer.launch({ headless: 'new', executablePath });

    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",  //disables LINUX sandboxing
        "--single-process",
        "--no-zygote"  //to not run too many chromium processes at same time
      ],
      executablePath: process.env.NODE_ENV === 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath()
    });

    //@@@@@@@ 2023-06-24: keep getting "Something went wrong while running Puppeteer :( Error: Requesting main frame too early!"
    
    try{
      // const page = await browser.newPage();

      // await new Promise((resolve) => { setTimeout(resolve, 9000); });

      // throw new Error("whooops!"); //testing to see if try catch works
    
      // await page.goto('https://pipandebby.com/wprm_print/8249', {waitUntil: "domcontentloaded", timeout: 90000});  //Apple Jam Pie Recipe Without Pectin
    
      // // Set screen size
      // await page.setViewport({width: 1080, height: 1024});
    
      // // Type into search box
      // // await page.type('.search-box__input', 'automate beyond recorder');
    
      // // Wait and click on first result
      // const searchResultSelector = '.wprm-block-text-bold';
      // // await page.waitForSelector(searchResultSelector);
      // // await page.click(searchResultSelector);
    
      // // Locate the full title with a unique string
      // const textSelector = await page.waitForSelector(searchResultSelector);
      // const fullTitle = await textSelector?.evaluate(el => el.textContent);
    
      // // Print the full title
      // console.log('The title of this recipe post is "%s".', fullTitle);

      // res.send(fullTitle);  //i added based on tutorial

      const [page] = await browser.pages();
			  
				console.log('Navigating to Galleria url ...');
			  
				await page.goto("https://www.galleriasm.com/Category/ProductListWithCate?Searchtext=AE05&BranchNo=002&langCode=EN&Sort=&TotalCount=40&CurrrentPage=1&Pagesize=40&MakerName=&avail=Y", {waitUntil: "domcontentloaded", timeout: 9000});
			  
				const divProdList = await page.waitForSelector('#divProdList');

				//2023-03-04: https://stackoverflow.com/questions/53252584/screenshot-for-each-dom-node
				const itemImg = await page.$$('.product-image');

				let bakedItems = await page.evaluate(() => {
			  
				  	var bakedNames = Array.from(document.querySelectorAll('.item > div > .item-info > div > .item-title'));
					var bakedPrice = Array.from(document.querySelectorAll('.item > div > .item-info > div > .item-content > div > div > span > span:first-child'));
					
					// return [itemNamePrice.map(el => el.textContent), itemImg.map(el => el.getAttribute('src'))];
					return [bakedNames.map(el => el.textContent), bakedPrice.map(el => el.textContent)];
					  
				});
			  
		
			  console.log('The titems from Galleria are "%s".', bakedItems);

        res.send(bakedItems);
			  

    }catch (err){

      console.log(`There is an error : ${err}`);

      res.send(`Something went wrong while running Puppeteer :(  ${err}`);

    } finally{
      await browser.close();
    }

    
    
};

module.exports = { scrapeLogic };

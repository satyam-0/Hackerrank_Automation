// node HakerrankKaAutomation.js --url=https://www.hackerrank.com  --config=config.JSON

// Modify your  config file

//npm init -y
// npm install minimist
// npm install fs
// npm intsall puppeteer

let minimist = require("minimist");
let fs = require("fs");
let puppeteer = require("puppeteer");
let args = minimist(process.argv);

//console.log(args.url);
//console.log(args.config);


let configJSON = fs.readFileSync(args.config, "utf-8");
let config = JSON.parse(configJSON);

async function run() {

    let browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null });
    let page = await browser.newPage();
    await page.goto(args.url);

    //await pages.screenshot({ path: "g.png" });
    await page.waitForSelector("a[data-event-action='Login']");
    await page.click("a[data-event-action='Login']");

    // await page.waitFor(3000);

    await page.waitForSelector("a[href='https://www.hackerrank.com/login']");
    await page.click("a[href='https://www.hackerrank.com/login']");

    await page.waitForSelector("input[name='username']");
    await page.type("input[name='username']", config.userid, { delay: 60 });


    await page.waitForSelector("#input-2");
    await page.type("#input-2", config.password, { delay: 60 });


    await page.waitForSelector("button[data-analytics='LoginPassword']");
    await page.click("button[data-analytics='LoginPassword']");


    await page.waitForSelector("a[data-analytics='NavBarContests']");
    await page.click("a[data-analytics='NavBarContests']");


    await page.waitForSelector("a[href='/administration/contests/']");
    await page.click("a[href='/administration/contests/']");



    // find total no. of pages So that we can iterate every page

    await page.waitForSelector("a[data-attr1='Last']");
    let numpage = await page.$eval("a[data-attr1='Last']", function(atag) {
        let totalpage = atag.getAttribute("data-attr8");
        parseInt(totalpage);

        return totalpage;
    });

    console.log(numpage);
    // get all the urls of first page

    for (j = 0; j <= numpage; j++) {
        await page.waitForSelector("a.backbone.block-center");
        let curls = await page.$$eval("a.backbone.block-center", function(atags) {
            let urls = [];

            for (i = 0; i < atags.length; i++) {

                let url = atags[i].getAttribute("href");

                urls.push(url);
            }

            return urls;
        });
        //curls me sare url ka array aa gya 
        // console.log(curls);


        //get a new page and open there moderator link and then perform your work
        for (i = 0; i < curls.length; i++) {

            let ctab = await browser.newPage();
            await ctab.bringToFront();
            await ctab.goto(args.url + curls[i]);


            //write code for adding moderator 

            await ctab.waitFor(3000);

            await ctab.waitForSelector("li[data-tab='moderators']");
            await ctab.click("li[data-tab='moderators']");




            await ctab.waitForSelector("input#moderator");
            await ctab.type("input#moderator", config.moderators, { delay: 80 });
            await ctab.keyboard.press("Enter");



            await ctab.waitFor(2000);
            await ctab.close();


        }

        if (j != numpage) {
            await page.waitForSelector("a[data-attr1='Right']");
            await page.click("a[data-attr1='Right']");
        }

    }
    await browser.close();
    console.log("close brower");


}

run();


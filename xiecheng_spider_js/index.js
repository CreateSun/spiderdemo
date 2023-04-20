const puppeteer = require('puppeteer');
const fs = require("fs")

const urlFunc = (page) => `https://you.ctrip.com/travels/shanghai2/t2${page > 1 ? '-p' + page : ''}.html`

const pageList = [1, 2, 3, 4, 5]
// const pageList = [1,2]

let data = {}

const main = async () => {
    // 启动浏览器
    const browser = await puppeteer.launch({
        headless: false, // 默认是无头模式，这里为了示范所以使用正常模式
    })

    pageList.forEach(async (num, index) => {
        // 控制浏览器打开新标签页面
        const url = urlFunc(num)
        const page = await browser.newPage()
        // 在新标签中打开要爬取的网页
        await page.goto(url)

        // 使用evaluate方法在浏览器中执行传入函数（完全的浏览器环境，所以函数内可以直接使用window、document等所有对象和方法）
        let res = await page.evaluate(() => {
            let list = document.querySelectorAll('.journalslist .journal-item')
            let res = []
            for (let i = 0; i < list.length; i++) {
                res.push({
                    href: list[i].getAttribute('href'),
                    img: list[i].querySelector('img').getAttribute('src'),
                    title: list[i].querySelector('dl .ellipsis').innerText,
                    desc: list[i].querySelector('dl .item-short').innerText,
                })
            }
            return res
        })
        Object.assign(data, { ['page' + num]: res })
        console.log(index, pageList.length - 1)
        if (index == pageList.length - 1) {
            console.log(data)
            await fs.writeFileSync("data.json", JSON.stringify({ data }), {
                encoding: 'utf-8'
            })
        }
    })



    // browser.close()

}


main()
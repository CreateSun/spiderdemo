const puppeteer = require('puppeteer');


const urlFunc = (page) => `https://you.ctrip.com/travels/shanghai2/t2${page ? '-p' + page : ''}.html`

// const pageList = [2, 3, 4, 5]
const pageList = [2]



const main = async () => {
    // 启动浏览器
    const browser = await puppeteer.launch({
        headless: false, // 默认是无头模式，这里为了示范所以使用正常模式
    })

    pageList.forEach(async num => {
        // 控制浏览器打开新标签页面
        const url = urlFunc(num)
        const page = await browser.newPage()
        // 在新标签中打开要爬取的网页
        await page.goto('https://you.ctrip.com/travels/shanghai2/t2-p2.html')

        // 使用evaluate方法在浏览器中执行传入函数（完全的浏览器环境，所以函数内可以直接使用window、document等所有对象和方法）
        let data = await page.evaluate(() => {
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
        console.log(data)
    })

}


main()
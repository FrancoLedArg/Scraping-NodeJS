const puppeteer = require('puppeteer')

const options = {
  headless: false,
  defaultViewport: false
}

const gotoptions = {
  waitUntil: 'load'
}

async function scrapePage (page) {
  try {
    const data = await page.evaluate(() => {
      const elements = document.querySelectorAll('.ui-search-result__wrapper')

      const extracted = Array.from(elements).map(e => {
        const title = e.querySelector('.ui-search-item__title')
        const price = e.querySelector('.ui-search-price__part')
        const image = e.querySelector('.ui-search-result-image__element')

        return {
          title: title ? title.textContent.trim() : '',
          price: price ? price.textContent.trim() : '',
          image: image ? image.getAttribute('src').trim() : ''
        }
      })

      return extracted
    })

    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function pagination () {
  const browser = await puppeteer.launch(options)
  const page = await browser.newPage()

  try {
    await page.goto('https://listado.mercadolibre.com.ar/guitarras#D[A:guitarras]', gotoptions)

    let next = await page.$('.andes-pagination__button--next')

    while (next) {
      const data = await scrapePage(page)
      console.log(data, page)

      await next.click()

      await page.waitForNavigation({ waitUntil: 'load', timeout: 60000 })

      next = await page.$('.andes-pagination__button--next')
    }
  } catch (error) {
    console.error(error)
  } finally {
    await browser.close()
  }
}

module.exports = pagination

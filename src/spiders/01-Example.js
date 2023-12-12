const puppeteer = require('puppeteer')

const options = {
  headless: false,
  defaultViewport: false
}

async function example () {
  const browser = await puppeteer.launch(options)
  const page = await browser.newPage()

  await page.goto('https://www.mercadolibre.com.ar/c/herramientas#menu=categories')

  try {
    const data = await page.evaluate(() => {
      const elements = document.querySelectorAll('.dynamic-carousel__link-container')

      const extracted = Array.from(elements).map(e => {
        const title = e.querySelector('.dynamic-carousel__title')
        const price = e.querySelector('.dynamic-carousel__price span')
        const image = e.querySelector('.dynamic-carousel__img')

        return {
          title: title ? title.textContent.trim() : '',
          price: price ? price.textContent.trim() : '',
          image: image ? image.getAttribute('src').trim() : ''
        }
      })

      return extracted
    })

    console.log(data)
  } catch (error) {
    console.log(error)
  }

  await browser.close()
}

module.exports = example

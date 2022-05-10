import express, { Request, Response } from 'express'
import { readFileSync } from 'fs'
import Handlebars from 'handlebars'
import path from 'path'
import puppeteer from 'puppeteer'

const app = express()

app.get('/', async (req: Request, res: Response) => {
  try {
    const browser = await puppeteer.launch()
    const [page] = await browser.pages()

    const { templateType = 'basic', title, date } = req.query

    const template = readFileSync(
      path.join(process.cwd(), `src/templates/${templateType}/index.hbs`),
      'utf8'
    )

    const html = Handlebars.compile(template)({
      title,
      // get date in this format - 21st April 2020
      date:
        date ??
        new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
    })

    await page.setContent(html)
    const take = await page.$('.image')
    await take.screenshot({
      path: 'screenshot.png'
    })

    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
    res.sendFile(path.join(process.cwd(), 'screenshot.png'))

    await browser.close()
  } catch (err) {
    console.error(err)
    res.send('Error')
  }
})

module.exports = app

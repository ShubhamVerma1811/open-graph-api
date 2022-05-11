import chromium from 'chrome-aws-lambda'
import express, { Request, Response } from 'express'
import { readFileSync } from 'fs'
import Handlebars from 'handlebars'
import path from 'path'

const app = express()

app.get('/', async (req: Request, res: Response) => {
  try {
    const browser = await chromium.puppeteer.launch({
      args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
      ignoreHTTPSErrors: true
    })
    // const browser = await chromium.puppeteer.launch()
    const [page] = await browser.pages()

    const { template = 'basic', title, date } = req.query

    const _template = readFileSync(
      path.join(process.cwd(), `src/templates/${template}/index.hbs`),
      'utf8'
    )

    const html = Handlebars.compile(_template)({
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
    const ss = await take.screenshot()
    await browser.close()

    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
    res.send(ss)
  } catch (err) {
    console.error(err)
    res.send('Error')
  }
})

module.exports = app

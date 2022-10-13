const express = require('express')
const cors = require('cors')
const puppeteer = require('puppeteer-core')
const app = express()
const PORT = process.env.PORT || 5000

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.get('/loginSenior', async (req, res) => {
  console.log(req.query)
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    headless: true,
    ignoreHTTPSErrors: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()
  const navigationPromise = page.waitForNavigation()
  const { email, password } = req.query
  console.log({ email })

  await page.goto('https://platform.senior.com.br/login/?redirectTo=https%3A%2F%2Fplatform.senior.com.br%2Fsenior-x%2F&tenant=gazin.com.br')

  await page.setViewport({ width: 1720, height: 1216 })

  await page.waitForSelector('#username-input-field')
  await page.click('#username-input-field')

  await page.type('#username-input-field', email)

  await page.waitForSelector('#password-input-field')
  await page.click('#password-input-field')

  await page.type('#password-input-field', password)

  await page.waitForSelector('#loginbtn')
  await page.click('#loginbtn')

  await navigationPromise

  await page.waitForSelector('.profile-side-menu > #menu-item-profile > app-menu-item > #menu-item-Dados\\ do\\ usu\\E1rio > .menu-item')
  await page.click('.profile-side-menu > #menu-item-profile > app-menu-item > #menu-item-Dados\\ do\\ usu\\E1rio > .menu-item')

  await page.waitForSelector('.no-scroll-child-container > #menu-item-3 > #menu-item-Gest\\E3o\\ de\\ Pessoas\\ \\|\\ HCM > .menu-item > .fa')
  await page.click('.no-scroll-child-container > #menu-item-3 > #menu-item-Gest\\E3o\\ de\\ Pessoas\\ \\|\\ HCM > .menu-item > .fa')

  await page.waitForSelector('.menu-apps > #menu-apps-list-items > #apps-menu-item-0 > span > .pull-left')
  await page.click('.menu-apps > #menu-apps-list-items > #apps-menu-item-0 > span > .pull-left')

  await page.waitForSelector('.menu-apps > #menu-apps-list-items > #apps-menu-item-1 > span > .pull-left')
  await page.click('.menu-apps > #menu-apps-list-items > #apps-menu-item-1 > span > .pull-left')

  const cookies = await page.cookies()

  const token = cookies.find((cookie) => cookie.name === 'com.senior.token')

  if (token) {
    const accessToken = JSON.parse(decodeURIComponent(token?.value)).access_token
    console.log(accessToken)
    await browser.close()
    console.log(accessToken)
    res.send({ accessToken })
  }
})

app.listen(PORT, () => {
  console.log('Express server listening on port   ' + PORT, app.settings.env)
})

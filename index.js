const express = require('express')
const path = require('path')

const PORT = process.env.PORT || 5001

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  function initEmbeddedMessaging() {
    try {
      embeddedservice_bootstrap.settings.language = 'en_US'; // For example, enter 'en' or 'en-US'

      embeddedservice_bootstrap.init(
        '00D4C000000LPq8',
        'NW_edu_Web_Deployment_English',
        'https://formativ--devint.sandbox.my.site.com/ESWNWeduWebDeployment1706023343860',
        {
          scrt2URL: 'https://formativ--devint.sandbox.my.salesforce-scrt.com'
        }
      );
    } catch (err) {
      console.error('Error loading Embedded Messaging: ', err);
    }
  };
const express = require('express')
const path = require('path')

const PORT = process.env.PORT || 5001

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

//   function initEmbeddedMessaging() {
//     try {
//         embeddedservice_bootstrap.settings.language = "en_US"; // For example, enter 'en' or 'en-US'

//         embeddedservice_bootstrap.init(
//             "00D7c000006tgG8",
//             "NW_edu_Deployment",
//             "https://formativ--dev.sandbox.my.site.com/ESWNWeduDeployment1705074359880",
//             {
//                 scrt2URL: "https://formativ--dev.sandbox.my.salesforce-scrt.com",
//             }
//         );
//     } catch (err) {
//         console.error("Error loading Embedded Messaging: ", err);
//     }
// }
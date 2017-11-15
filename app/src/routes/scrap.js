import express from 'express';

import { Scrap } from '../models';
import { twitter_provider } from '../providers/twitter';
import { createUserFromTwitter } from '../utils';

const router = express.Router();

router.get('/', async() => {
  try{
    const tweets = await twitter_provider.get('search/tweets', { q: 'rt since:2015-06-08', count: 100 });
    for(var tweets_statue of tweets.statuses) {
      const scrapes = await Scrap.find({ twitter_id: tweets_statue.user.id });
      if(scrapes.length > 0) {
        scrapes[0].occurs = scrapes[0].occurs + 1;
        await scrapes[0].save();
        let scrap = new Scrap();
        scrap.twitter_id = tweets_statue.user.id;
        scrap.location = tweets_statue.user.location;
        scrap.followers_count = tweets_statue.user.followers_count;
        scrap.created_at = tweets_statue.created_at;
        scrap.lang = tweets_statue.lang;
        scrap.time_zone = tweets_statue.user.time_zone;
        scrap.verified = tweets_statue.user.verified;
        scrap.statuses_count = tweets_statue.user.statuses_count;
        await scrap.save();
      }
    }
  }catch(err) {
    console.log(err);
  }
});
  

router.get('/populate/', async(req, res) => {
  try{
    let scrapes = await Scrap.find({ scraped: { $exists: false } }).limit(100000).exec();
    var scrapList = [];
    var scrapObject = [];
    var j = 0, boucle = 1;
    for(var i = 0; i < scrapes.length; i++) {
      if(j > 99) {
        const closureScrapToFace = async() => {
          var currentList = _.uniq(scrapList);
          var scrapObjectTemp = _.uniq(scrapObject);
          var number = i + 3;
          const insertScrapToFace = async() => {
            const users = twitter_provider.get('users/lookup', { user_id: currentList.join(',') });
            for(var k = 0; k < users.length; k++) {
              createUserFromTwitter(users[k], number);
              number += 3;
            }
            for(var s = 0; s < scrapObjectTemp.length; s++) {
              scrapObjectTemp[s].scraped = true;
              scrapObjectTemp[s].save();
            }
          };
          return insertScrapToFace;
        };
        setTimeout(closureScrapToFace(), (boucle * 15000));
        scrapList.splice(0, scrapList.length);
        scrapObject.splice(0, scrapObject.length);
        j = 0;
        boucle++;
      }
      scrapList.push(scrapes[i].twitter_id);
      scrapObject.push(scrapes[i]);
      j++;
    }
    res.json('works');
  }catch(err) {
    console.log(err);
  }
});

export default router;

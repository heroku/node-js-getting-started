import express from 'express';

import {Scrap} from '../models';
import {twitter_provider} from '../providers/twitter';
import {createUserFromTwitter} from '../utils'

const router = express.Router();

router.get('/', (req, res, next) => {

    var client = twitter_provider;  
  
    client.get('search/tweets', {q: 'rt since:2015-06-08', /*lang:'en',*/ count:100}, (error, tweets, response) =>{
  
       for(var i= 0; i < tweets.statuses.length; i++){
  
          function closureAddScrap(){
           var currentTweet = tweets.statuses[i];
  
           function addScrap(){
             Scrap.find({twitter_id: currentTweet.user.id}, (err, scrapes) => {
  
                 if(scrapes.length > 0){
                   userExist = true;
                   scrapes[0].occurs = scrapes[0].occurs + 1;
                   scrapes[0].save((err) => {
                       if (err){
                         console.log('SCRAPE UPDATED', err);
                       }
                   });
                 }else{
  
                 var scrap = new Scrap();
                 /*Name: {{this.user.name}}
                 Lang: {{this.lang}}
                 Location: {{this.user.location}}
                 Followers_count:{{this.user.followers_count}}
                 Created_at: {{this.created_at}}
                 Time_zone: {{this.user.time_zone}}
                 Verified: {{this.user.verified}}
                 Status_count: {{this.user.statuses_count}}
                 Last update: {{this.user.status.created_at}}*/
                 scrap.twitter_id= currentTweet.user.id;
                 scrap.location= currentTweet.user.location;
                 scrap.followers_count= currentTweet.user.followers_count;
                 scrap.created_at= currentTweet.created_at;
                 scrap.lang= currentTweet.lang;
                 scrap.time_zone= currentTweet.user.time_zone;
                 scrap.verified= currentTweet.user.verified;
                 scrap.statuses_count= currentTweet.user.statuses_count;
  
                 scrap.save((err) => {
                     if (err){
                       console.log('ERROR SAVE NUMBER', err);
                     }
  
  
                 });
               }
             });
           }
           return addScrap;
         }
         var closure = closureAddScrap();
         closure();
       }
       res.render('scraping', {'tweets': tweets});
    });
  
  });
  

router.get('/populate/', (req, res, next) => {
    
      var client = twitter_provider;
    
    Scrap.find({scraped: {$exists: false }}).limit(100000).exec((err, scrapes) => {
        var scrapList = [];
        var scrapObject = [];
        var j = 0, boucle = 1;

        for(var i = 0; i < scrapes.length; i++){

        if(j > 99){

            function closureScrapToFace() {
            var currentList = _.uniq(scrapList);
            var scrapObjectTemp = _.uniq(scrapObject);
            var number = i + 3;

            function insertScrapToFace() {
                client.get('users/lookup', {user_id: currentList.join(',')}, (error, users, response) =>{
                    if(users){
                    for(var k = 0; k < users.length; k++){
                        createUserFromTwitter(users[k], number);
                        number += 3;
                    }
                    }

                    for(var s = 0; s < scrapObjectTemp.length; s++){
                    scrapObjectTemp[s].scraped = true;
                    scrapObjectTemp[s].save((erreur) =>{
                        if(erreur){
                        console.log('ERREUR SAVE SCRAPED', this);
                        }
                    });
                    }

                });
            }
            return insertScrapToFace;
            }

            setTimeout(closureScrapToFace(), (boucle * 15000));
            scrapList.splice(0,scrapList.length);
            scrapObject.splice(0,scrapObject.length);

            j = 0;
            boucle++;
        }

        scrapList.push(scrapes[i].twitter_id);
        scrapObject.push(scrapes[i]);

        j++;
        }

    });
    res.json('works');
});

export default router;
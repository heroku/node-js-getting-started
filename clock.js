//OnInterval
var threeSecondInterval = function(){
    console.log("Another 3 seconds have gone by. What did you do in them?");
}
setInterval(threeSecondInterval, 3000)

//For specific times, use a chron job
var fifteenSeconsAfterMinute = function() {
  console.log("Another minute is gone forever. Hopefully, you made the most of it...");
}
var CronJob = require('cron').CronJob;
new CronJob({
  cronTime: "15 * * * * *",//15 seconds after every minute
  onTick: fifteenSeconsAfterMinute,
  start: true,
  timeZone: "America/Los_Angeles"
});
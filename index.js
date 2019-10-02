const {RTMClient} = require('@slack/client');
const token = process.env.SLACK_TOKEN || `xoxp-2338385904-155172535671-780148429172-8110289b32ece5e0d2c396d4b9a37391`;
const rtm = new RTMClient(token);
rtm.start();

rtm.on(`message`,(message)=>{
  var text = message.text;

  if(text.includes("test")){
    rtm.sendMessage("testOK",message.channel);
  }

  else if(text.includes("hey dailyBot")){
    rtm.sendMessage("yessir?",message.channel)
  }
});

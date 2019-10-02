const {RTMClient} = require('@slack/client');
const token = process.env.SLACK_TOKEN || `xoxb-2338385904-768981846963-99WLYRrFavcvFsfM7MzD3kLh`;
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

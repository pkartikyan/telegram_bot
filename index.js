const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Telegram's token
const token = '5083899624:AAFp6gLejNB8oVtGGDkkWEhArn1SjRXnwN0';

//OpenWeatherMap API key
const appID = 'b7643363649c15cc7d7f333a32424bf5';
const botID= 'chic-capsule-sg';

// OpenWeatherMap endpoint for getting weather by city name



// URL that provides icon according to the weather
const weatherIcon = (icon) => `http://openweathermap.org/img/w/${icon}.png`;

// Template for weather response
const weatherHtmlTemplate = (name, main, weather, wind, clouds) => (
  `The weather in <b>${name}</b>:
<b>${weather.main}</b> - ${weather.description}
Temperature: <b>${main.temp} °C</b>
Pressure: <b>${main.pressure} hPa</b>
Humidity: <b>${main.humidity} %</b>
Wind: <b>${wind.speed} meter/sec</b>
Clouds: <b>${clouds.all} %</b>
`
);

// Created instance of TelegramBot
const bot = new TelegramBot(token, {
  polling: true
});

// Function that gets the weather by the city name
const getResponse = (chatId, fromMsg) => {
    
   // const botUrl = `https://two.samuraai.cc/api/v1/bots/${botID}/converse/${chatId}`;
    const botUrl = ` https://one.samuraai.cc/api/v1/bots/stellar-bali/converse/843306190`;
    console.log ("boturl"+botUrl);
    const endpoint = botUrl;
    const msg = `${fromMsg}`;
    let text ="";
    let RKM="";
    let keyboard="";
   

    var data = JSON.stringify({
        "type": "text",
        "text": msg
    });

  console.log (data);

  var config = {
    method: 'post',
    url: botUrl,
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios(config)
  .then( response =>  {
    console.log(JSON.stringify(response.data));

    let { responses } = response.data;
console.log(responses);
    
responses.forEach((value, key) => {
console.log("vijay");
    console.log("key =>", key, "value =>", value.text,"TYPE =>", value.type);

    //checking whether its text
    if(value.type === 'text' ){

        bot.sendMessage(
            chatId,
            value.text
          );
          return;
    }

    if(value.type === 'file' ){



      bot.sendPhoto(
          chatId,
          value.url
        );
        return;
  }

    if(value.component === 'QuickReplies' ){
        body = value.wrapped.text;
        console.log("printing body of option" + body)

        quickOptions = value.quick_replies;

        console.log("quickreplies printing ---" + JSON.stringify(quickOptions))

        //[{"title":"YES!","payload":"YES"},{"title":"NO !.","payload":"NO"}]

          var keyboards = {  
            main_menu: {
                reply_markup: {
                    keyboard: [
                      quickOptions.map(x => ({text: x.title}))
                       // [{text: "Yes"}, {text: "No"}]
                     
                    ],
                    one_time_keyboard: true
                }
            }
        };

        bot.sendMessage(
          chatId,
          body,
          keyboards.main_menu
        );
        return;

    }

});

  })
  .catch(function (error) { 
    console.log(error);
  });

  
  
}

// Listener (handler) for telegram's /weather event
bot.onText(/\/weather/, (msg, match) => {
  const chatId = msg.chat.id;
  const city = match.input.split(' ')[1];

  if (city === undefined) {
    bot.sendMessage(
      chatId,
      `Please provide city name`
    );
    return;
  }
  getWeather(chatId, city);
});


bot.onText(/(.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const fromMsg = msg.text;
console.log (msg.text);  
console.log ("printing chat id"+ chatId);  
if(msg.photo){
  console.log ("photo getting");
}
    getResponse(chatId, fromMsg);
  });

// Listener (handler) for telegram's /start event
// This event happened when you start the conversation with both by the very first time
// Provide the list of available commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Welcome to wwalks boot , thank you for using my service
    
Available commands:

/weather <b>city</b> - shows weather for selected <b>city</b>
  `, {
      parse_mode: "HTML"
    }
  );
});

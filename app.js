
//load express module
const express = require('express')
const bodyparser = require('body-parser')

//load https module
const https = require('https')


//initialize express module
const app = express()

app.use(bodyparser.urlencoded({ extended: true }))

// 1) ---client requests for the weather info from the server(express)
// 2) ---but as your server is relying on someone else's server for that data then it will request other server via API under its .get() method
app.get("/", function(req, res) {

  //3) ---for requesting other server, we either use node's native "HTTPS" module, or "AXIOS" etc.
  // [DONT FORGET to add https:// before URL] .... why .... because here we are in a server and not in a browser, server cannot do that
  const url = "https://api.openweathermap.org/data/2.5/weather?q=Mumbai&units=metric&appid="

  https.get(url, function (response) {
    console.log(response.statusCode);

    //4) ---our data should be parsed so that it should be filtered and readable [using .on() method of response to tap data]
    // we can now tap into "data" to retrieve data
    response.on("data", function(data) {
      const weatherData = JSON.parse(data)
      console.log(weatherData);

      // const object = {
      //   name: "Hector",
      //   hitname: "killfry"
      // }
      //
      // const objString = JSON.stringify(object)
      // console.log(objString);


      console.log(weatherData.weather);

      const weatherDesc = weatherData.weather[0].description
      const temp = weatherData.main.temp
      const icon = weatherData.weather[0].icon   // first get hold of icon data
      const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`   // second get hold of its image corresponding (URL available on API site)

      //---using express to RENDER the website with the live API data
      // res.send(`<h1>The temperature in Mumbai is ${temp} degrees Celcius and the weather is ${weatherDesc}</h1>`)

      res.write(`<p>The weather is currently ${weatherDesc}</p>`)
      res.write(`<h1>The weather is ${temp} degrees Celcius in Mumbai</h1>`)
      res.write(`<img src="${imageURL}">`)

      res.send()
    })
  })

  //res.send can only be called once, since it is equivalent to res.write + res.end()
  //res.end() Ends the response process.
  //Hence two res.send() cant work in one file

  // res.send("Server is up and running!")
})

app.get("/cityweather", function(req, res) {
  res.sendfile(__dirname + "/index.html")
})


app.post("/cityweather", function(req, res) {

  console.log("Post request recieved");

  const cityName = req.body.cityname
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=b40395dce37022e256d3be7ec2a30480`
  console.log(cityName);
  console.log(apiURL);

  https.get(apiURL, function(response) {
    response.on("data", function(data) {
      const weatherData = JSON.parse(data)
      console.log(weatherData)

      const weatherDesc = weatherData.weather[0].description
      const temp = weatherData.main.temp
      const icon = weatherData.weather[0].icon   // first get hold of icon data
      const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`   // second get hold of its image corresponding (URL available on API site)

      //---using express to RENDER the website with the live API data
      // res.send(`<h1>The temperature in Mumbai is ${temp} degrees Celcius and the weather is ${weatherDesc}</h1>`)

      res.write(`<p>The weather is currently ${weatherDesc}</p>`)
      res.write(`<h1>The weather is ${temp} degrees Celcius in ${cityName}</h1>`)
      res.write(`<img src="${imageURL}">`)

      res.send()
    })
  })

})


app.listen(3000, function() {
  console.log("Server is running at port 3000");
})

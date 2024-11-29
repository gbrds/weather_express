const express = require('express')
const path = require('path')
const { deserialize } = require('v8')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const key = '82ec2ecd496644610e4d031cff77967a' // API key

const getweatherData = (city) => {
    return new Promise((resolve, reject) => {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
        fetch(url)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            let description = data.weather[0].description
            let city = data.name
            let temp = Math.round(parseFloat(data.main.temp)-273.15)
            const result = {
                description: description,
                city: city,
                temp: temp
            }
            resolve(result)
        })
        .catch(error => {
            reject(error)
        })
    })
}

app.all('/', (req, res) => {
    let city
    if(req.method == 'GET'){
        city = 'tartu'
    }
    else if (req.method == 'POST'){
        city = req.body.cityname
    }
    getweatherData(city)
    .then((data) => {
        res.render('index', data)
    })
})

app.listen(3002)
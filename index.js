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
let city = 'Tartu'

app.get('/', (req, res) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`)
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        let description = data.weather[0].description
        let city = data.name
        let temp = Math.round(parseFloat(data.main.temp)-273.15)
        console.log(description)
        console.log(city)
        console.log(temp)
        
        res.render('./index', {
            description: description,
            city: city,
            temp: temp
        })
    })
})

app.post('/', (req, res) => {
    let city = req.body.cityname
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`)
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        let description = data.weather[0].description
        let city = data.name
        let temp = Math.round(parseFloat(data.main.temp)-273.15)
        res.render('index', {
            description: description,
            city: city,
            temp: temp
        })
    })
})

app.listen(3002)
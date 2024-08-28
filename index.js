const moment = require('moment')
const SunCalc = require('suncalc')
const fs = require('fs')

function convertToCsv(arr) {
    arr = arr.map(e => Object.values(e).map(e => moment(e)))
    arr = arr.map(e => [moment.utc(e[6]), moment.utc(e[2])])
    arr = arr.map(e => [e[0].format("DD.MM"), e[0].format("HH:mm"), e[1].format("HH:mm"), Math.floor(moment.duration(e[1] - e[0]).asMinutes())])
    return arr.map(e => `${e[0]} # ${e[1]} # ${e[2]} # ${e[3]}`).join('\n')
}
// function convertToCsv(arr) {
//     arr = [Object.keys(arr[0]), ...arr.map(e => Object.values(e).map(e => moment.utc(e).format("DD.MM.YY HH:mm")))]
//     arr = arr.map(arr => [arr[6], arr[2]])
//     return arr.map(e => e.join(',')).join('\n')
// }
// function convertToCsv(arr) {
//     arr = [Object.keys(arr[0]), ...arr.map(e => Object.values(e).map(e => 25569 + moment.utc(e).unix() / (24 * 60 * 60)))]
//     arr = arr.map(arr => [arr[6], arr[2]])
//     return arr.map(e => e.map(e => `"${e}"`.replace('.', ',')).join(',')).join('\n')
// }

const first = moment('2024-01-01T12:00:00Z')
const last = moment('2024-12-31T12:00:00Z')

let arr = [first]
let current = first
while (current < last) {
    arr = [...arr,  moment(current).add(1, 'days')]
    current = arr[arr.length - 1]
}

const step = 5 * 60 * 1000

const data = arr.map(e => SunCalc.getTimes(e, 48.54150, 9.82790, 323))

fs.writeFileSync('./suncalc.csv', convertToCsv(data), 'utf-8')


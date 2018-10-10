const fs = require('fs')
const path = require('path')
const { getState, mergeState } = require('../db')
const config = require('../config')
const convertMmoData = require('../convert-data')
const dataFilePath = path.join(__dirname, '../build.mmo.json')
const mmoDataFilePath = path.join(__dirname, '../mmo.json')

// Convert the mmo json data to fb compliant json
const mmoData = require(mmoDataFilePath)
const convertedData = convertMmoData(mmoData)

// Write the fb json to disk so it can be required
fs.writeFileSync(dataFilePath, JSON.stringify(convertedData, null, 2))

// Require the fb json file
const data = require(dataFilePath)

module.exports = [{
  plugin: require('digital-form-builder-engine'),
  options: { data: data, getState, mergeState, ordnanceSurveyKey: config.ordnanceSurveyKey }
}, {
  plugin: require('digital-form-builder-designer'),
  options: { path: dataFilePath }
}]

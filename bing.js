var url = require('url')
  , request = require('request')

//encoded according to base 64 with a colon separating account key twice
//key: ISH/E8cOf3j2/Yt3hOyT1iAFEtwmd7btxLr4HvauL3w
var ACCOUNT_KEY = 'SVNIL0U4Y09mM2oyL1l0M2hPeVQxaUFGRXR3bWQ3YnR4THI0SHZhdUwzdzpJU0gvRThjT2YzajIvWXQzaE95VDFpQUZFdHdtZDdidHhMcjRIdmF1TDN3'
  , IMAGE_URL = 'https://api.datamarket.azure.com/Bing/Search/Image'

module.exports = function(mood, artist) {
  var urlObj = url.parse(IMAGE_URL)
  urlObj.query = {
      Query : '\'feelinggood\''
    , '$format' : 'json'
  }

  console.log(urlObj.format())

  var options = {
      url : urlObj.format()
    , headers : { Authorization : 'Basic ' + ACCOUNT_KEY }
  }
  request = request(options, function(err, res, body) {
    var json = JSON.parse(body)
    console.log('bing response: \n\t' + json)
  })

}

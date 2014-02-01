var auth = {
    consumerKey: "Jdy8fp6RC-3uO9eeh1K6IA",
    consumerSecret: "jfO1O9GH0eMamjUhZZa9byq82ho",
    accessToken: "6_s2AkZmUyYEuwGsJBvkzZlkdiigc7sP",
    accessTokenSecret: "ahhR0jRAKYVyaHBXGamMQCAY3yw",
    serviceProvider: {
        signatureMethod: "HMAC-SHA1"
    }
};
var terms = 'cafe';
var near = 'San+Francisco';
var accessor = {
    consumerSecret: auth.consumerSecret,
    tokenSecret: auth.accessTokenSecret
};

var parameters = [];
parameters.push(['term', terms]);
parameters.push(['location', near]);
parameters.push(['callback', 'cb']);
parameters.push(['oauth_consumer_key', auth.consumerKey]);
parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
parameters.push(['oauth_token', auth.accessToken]);
parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

var message = {
    'action': 'http://api.yelp.com/v2/search',
    'method': 'GET',
    'parameters': parameters
};

OAuth.setTimestampAndNonce(message);
OAuth.SignatureMethod.sign(message, accessor);

var parameterMap = OAuth.getParameterMap(message.parameters);
parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);
//console.log(parameterMap);

var getYelp = function() {
    $.ajax({
        'url': message.action,
        'data': parameterMap,
        'cache': true,
        'dataType': 'jsonp',
        'jsonpCallback': 'cb',
        'success': function(data, textStats, XMLHttpRequest) {
            console.log(data);
        }
    });
};

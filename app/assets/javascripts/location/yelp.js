var getMidpointCoords = function() {
    return "40.7278202,-73.9980006";
};

var getCategory = function() {
    return "cafe";
};

// this closure takes two parameters
// parameter1 = ll = "<latitude>,<longitude>"
// parameter2 = category = "<category>"
YELP = function(ll, category) {
    var auth = {
        consumerKey: "Jdy8fp6RC-3uO9eeh1K6IA",
        consumerSecret: "jfO1O9GH0eMamjUhZZa9byq82ho",
        accessToken: "6_s2AkZmUyYEuwGsJBvkzZlkdiigc7sP",
        accessTokenSecret: "ahhR0jRAKYVyaHBXGamMQCAY3yw",
        serviceProvider: {
            signatureMethod: "HMAC-SHA1"
        }
    };
    var accessor = {
        consumerSecret: auth.consumerSecret,
        tokenSecret: auth.accessTokenSecret
    };

    var parameters = [];
    parameters.push(['term', category]);
    parameters.push(['limit', "10"] );
    parameters.push( ["ll", ll] ) ;
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

    return function() {
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
}( getMidpointCoords(), getCategory() );

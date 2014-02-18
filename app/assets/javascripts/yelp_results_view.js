z = 1
var YelpView = function(model){
  var self = this;
  this.model = model;
  this.model.view = self;

  self.template = function(){
    // var html_array = [
     
    //  "<tr>", 
    //  "<td>",
    //   "<a href='"+ model.mobile_url + "'>" + model.name + "</a>",
    //  "</br>",
    //   "<img src='" + model.image_url +"'>",  
    //   "</br>",
    //   "<img src='" + model.rating_img +"'>",
    //   model.review_count,
    //   "</br>",
    //   model.address,
    //   "</br>",
    //   model.phone,
    //   "</br>",
    //   model.snippet_text,
    //   "</br>",
    //   "<button class='text-button' id = 'sms" + z + "'>",
    //   "Send Info via SMS",
    //   "</button>",
    //   "</td>",
    //  "</tr>",
    
    // ];

  var html_array = [
    "<h2><a href='"+ model.mobile_url + "'>" + model.name + "</a></h2>",
    "<div>",
    "<img src='" + model.image_url +"'>",  
    "</br>",
    "<img src='" + model.rating_img +"'>",
    model.review_count,
    "</br>",
    model.address,
    "</br>",
    model.phone,
    "</br>",
    model.snippet_text,
    "</br>",
    "<button class='text-button' id = 'sms" + z + "'>",
    "Send Info via SMS",
    "</button>",
    "</div>",
  ];


    
    
    return html_array.join("");
  }

  // this.render = function(){
  //   z+=1; 
  //   self.$element = $( self.template() );
  //   var tbody = $('table').find('tbody')
  //   tbody.append(self.$element);
  //   $('#results_map').fadeIn(3000);
  //   $('table').fadeIn("slow");
  // }

  this.render = function(){
    z+=1; 
    self.$element = $( self.template() );
    // var tbody = $('table').find('tbody')
    // $('#accordion').accordion();
    $('#accordion').append(self.$element);
    $('#results_map').fadeIn(3000);
    $('#accordion').fadeIn("slow");

    if (z === 6) {
      var headers = $('#accordion h2')

      $.each(headers, function(index, header){
        $(header).click(function(){
          $.each(app.markers, function(i, marker){
            marker.setIcon('http://maps.google.com/mapfiles/marker.png')
          })
          app.markers[index].setIcon('http://maps.google.com/mapfiles/marker_green.png')
        })
      })
    }
  }

  this.clickSms = function(){
    $('#sms' + z).click(function(){
      var phone = window.prompt("Enter Phone Number");
      var t = new api.TMessage(phone, "Meet me at " + model.name + ". " + model.address);
      console.log(phone);
      t.tmessage();
    })
  }
};

var api = {
  TMessage: function(contact_num, message){
  var self = this;
  this.data = {};
  this.contact_num = contact_num;
  this.message = message;

    this.tmessage = function(){
    var params = {
        text: {
          "contact_num": self.contact_num,
          "message": self.message,
        }
      };
    $.ajax({
      url: "/text",
      type: "get",
      data: params,
      dataType: "json",
      success: function(data){
        console.log("this works!");
      }
    }) 
  } 
}
};




    // $('.text-button').click(function(){
    //   var phone = window.prompt("Enter Phone Number");
    //   var t = new api.TMessage(phone, "Meet me at " + yelp_sms_name + ". " + yelp_sms_address);
    //   console.log(phone);
    //   t.tmessage();
    // })


 // 












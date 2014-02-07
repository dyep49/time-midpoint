var YelpView = function(model){
  var self = this;
  this.model = model;
  this.model.view = self;

  self.template = function(){
    var html_array = [
     
     "<tr>", 
     "<td>",
      "<a href='"+ model.mobile_url + "'>" + model.name + "</a>",
     "</br>",
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
      "<button class='text-button'>",
      "Send Info via SMS",
      "</button>",
      "</td>",
     "</tr>",
    
    ];

    $('.text-button').click(function(){
      var phone = window.prompt("Enter Phone Number");
      var t = new api.TMessage(phone, "This works!");
      console.log(phone);
      t.tmessage();
    })
    
    return html_array.join("");
  }
  this.render = function(){
    self.$element = $( self.template() );
    var tbody = $('table').find('tbody')
    tbody.append(self.$element);
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



 // 













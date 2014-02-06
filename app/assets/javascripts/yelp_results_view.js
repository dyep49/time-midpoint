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
      "</td>",
     "</tr>",
    
    ];
    return html_array.join("");
  }
  this.render = function(){
    self.$element = $( self.template() );
    var tbody = $('table').find('tbody')
    tbody.append(self.$element);
  }
};


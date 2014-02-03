var LocationView = function( yelp_obj ) {
    this.model = new location_model.Location( yelp_obj );
    this.model.movie_view = this;

    app.views.push( this );
};

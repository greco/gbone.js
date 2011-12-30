(function($){
  App.Routers.GlobalRouter = Backbone.Router.extend({
    routes: {
      '': 'index'
    },
    
    index: function () {
      // Start with the currency converter Panel.
      this.navigate('global-stage/currency-converter', true);
    }
  });
}).call(this, this.Zepto);
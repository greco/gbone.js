(function($){
  App.Views.CurrencyInfo = Gbone.Panel.extend({
    
    skeleton: function () { return JST.info; },
    
    transitionBindings: ['article'],
    
    className: 'info',
    
    events: {
      'tap header .back': 'back'
    },
    
    initialize: function (options) {
      _.bindAll(this);
      this.render();
    },
    
    render: function () {
      return this;
    },
    
    back: function () {
      this.stage.router.navigate('global-stage/currency-converter/trans-down', true);
    }
  });
}).call(this, this.Zepto);
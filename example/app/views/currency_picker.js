(function($){
  App.Views.CurrencyPicker = Gbone.Panel.extend({
    
    skeleton: function () { return JST.currencies; },
    
    transitionBindings: ['header', 'article'],
    
    className: 'currenciesPicker list',
    
    events: {
      'tap header .back': 'back'
    },
    
    initialize: function (options) {
      _.bindAll(this);
      this.converterData = options.converterData;
      this.title = options.title;
      this.bindEvents();
      this.render();
    },
    
    render: function () {
      this.$('header h2').html(this.title);
      this.addAll();
      return this;
    },
    
    bindEvents: function () {
      var that = this;
      this.bindTo(this.stage, 'currencyChange', function (currencyChange) {
        that.currencyChange = currencyChange;
      });
    },
    
    addAll: function () {
      this.collection.each(this.addOne);
    },
    
    addOne: function (model) {
      var view = new App.Views.Currency({model: model});
      view.render();
      this.appendChildInto(view, 'article');
    },
    
    back: function () {
      this.stage.router.navigate('global-stage/currency-converter', true);
    }
  });
}).call(this, this.Zepto);
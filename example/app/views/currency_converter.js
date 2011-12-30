(function($){
  App.Views.CurrencyConverter = Gbone.Panel.extend({
    
    skeleton: _.template('<header><button class="info">info</button></header><article></article>'),
    
    transitionBindings: ['header', 'article'],
    
    events: {
      'touchstart .pad div': 'enter',
      'touchstart .pad .clear': 'clear',
      'touchstart .pad .point': 'point',
      'tap .input': 'changeFrom',
      'tap .output': 'changeTo',
      'tap .flip': 'flip',
      'tap .info': 'info'
    },
    
    initialize: function (options) {
      _.bindAll(this);
      
      $(this.el).addClass('currencies');
      this.bindEvents();
      this.model.addPoint = false;
      this.render();
    },
    
    render: function () {
      this.$('article').html(JST.index({model: this.model}));
      return this;
    },
    
    bindEvents: function () {
      var $el = $(this.el);
      
      this.bindTo(this.model, 'change', this.render);
      
      $el.bind('touchmove', function (e) { 
        e.preventDefault();
      });
    },
    
    clear: function () {
      this.model.addPoint = false;
      this.model.set({
        input: 0, 
        output: this.model.getOutput()
      });
    },
    
    enter: function (event) {
      var num = $(event.currentTarget).data('num'),
          input;
          
      if (!num) return;
      
      // Stop overflows
      if ((this.model.get('input') + '').length  > 8)
        return;
      if ((this.model.get('output') + '').length  > 8)
        return;
        
      num += '';
      
      // Prefix with decimal
      if (this.model.addPoint) {
        this.model.addPoint = false;
        num = '.' + num;
      }
      
      input = parseFloat(this.model.get('input') + num);
      this.model.set({
        input: input,
        output: this.model.getOutput(input)
      });
    },
    
    changeFrom: function () {
      this.stage.trigger('currencyChange', 'from');
      this.stage.router.navigate('global-stage/currency-picker', true);
    },
    
    changeTo: function () {
      this.stage.trigger('currencyChange', 'to');
      this.stage.router.navigate('global-stage/currency-picker', true);
    },
    
    flip: function () { 
      this.model.set({
        to: this.model.get('from'),
        from: this.model.get('to')
      }, {silent: true});
      
      this.model.set({
        output: this.model.getOutput(this.model.get('input'))
      });
    },
    
    info: function () {
      this.stage.router.navigate('global-stage/currency-info/trans-up', true);
    },
    
    point: function () {
      var input = this.model.get('input');

      // Return if already has point.
      if ((input % 1) !== 0) return;

      this.model.addPoint = true;
      this.model.set({
        output: this.model.getOutput(input)
      });
      this.model.trigger('change');
    }
    
  });
}).call(this, this.Zepto);
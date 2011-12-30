App.Collections.Currencies = Backbone.Collection.extend({
  model: App.Models.Currency,
  url: 'currencies.json'
});
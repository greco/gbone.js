# Gbone

Gbone.js is a framework written on top of [Backbone](https://github.com/documentcloud/backbone/) for building mobile JavaScript applications.

This project is heavily inspired by [Spine.Mobile](http://spinejs.com/mobile/index), especially the idea of Stages and Panels.  I really liked the framework but since it was built on top of [Spine](http://spinejs.com/), I wanted to write one for Backbone.  Some design patterns such as the `observer` and `cleanup` mixins were also influenced by [ThoughtBot](http://thoughtbot.com/)'s excellent ebook [Backbone.js on Rails](http://workshops.thoughtbot.com/backbone-js-on-rails).

## Dependancies

Gbone.js is dependant on [Backbone](https://github.com/documentcloud/backbone/), [Underscore](http://documentcloud.github.com/underscore/) and either [Zepto](http://zeptojs.com/) or [jQuery](http://jquery.com/).  Zepto is recommended over jQuery because it's lightweight and ideal for mobile webkit development.  The default transition effects used by the `transitions` mixin are dependant on [Zepto-GFX](https://github.com/gobhi/zepto-gfx) if Zepto is used, or [GFX](https://github.com/maccman/gfx) if jQuery is used.

_It's important to note that jQuery doesn't provide touch events.  So in order to implement touch events, you would need to use a third-party plugin.  For Zepto, touch events are provided out-of-box (another reason why Zepto is recommended over jQuery for Gbone)._

## Usage

Include `gbone.js` after including all the dependancies.  If using Zepto:

      <script src="zepto.js" type="text/javascript" charset="utf-8"></script>
      <script src="zepto-gfx.js" type="text/javascript" charset="utf-8"></script>
      <script src="underscore.js" type="text/javascript" charset="utf-8"></script>
      <script src="backbone.js" type="text/javascript" charset="utf-8"></script>
      <script src="gbone.js" type="text/javascript" charset="utf-8"></script>
      
...or if jQuery is used:

      <script src="jquery.js" type="text/javascript" charset="utf-8"></script>
      <script src="gfx.js" type="text/javascript" charset="utf-8"></script>
      <script src="underscore.js" type="text/javascript" charset="utf-8"></script>
      <script src="backbone.js" type="text/javascript" charset="utf-8"></script>
      <script src="gbone.js" type="text/javascript" charset="utf-8"></script>
      
## Gbone.Stage and Gbone.Panel Views

Stage and Panel are subclasses of `Backbone.View`.  They both use a template to render their skeleton html and have transition support.  Stages contain one or more Panels that are managed by an internal Panel manager.

## Gbone.Stage

Stages cover the entire viewport and they contain an element with class `viewport`.  The Panels are appended to this element.  Thus when setting a skeleton template for a Stage, remember to set an element within the skeleton to have class `viewport`.

An application displays only one Stage and Panel at a time.  The Stage's Panels are transitioned in and out to reveal the different parts of the application.

Typically the main Stage's DOM element `el` would be the document `body` and it's html (that's rendered using it's skeleton template) is appended to it.

All Stages come with a default skeleton template to render from.  This can be easily overridden when extending Gbone.Stage (provide it as an instance property - `skeleton`).

Default Stage skeleton:

      <header></header>
        <article class="viewport"></article>
      <footer></footer>

A Stage with the document `body` as it's `el` and the default skeleton template rendered into it:

      <body class="stage">
        <header></header>
        <article class="viewport"></article>
        <footer></footer>
      </body>

### Properties and methods of Gbone.Stage

_Note: Since `Gbone.Stage` extends `Backbone.View`, these are additional methods and properties provided on top of the ones provided by `Backbone.View`.  However, some properties and methods of `Backbone.View` may be mentioned here as well if needed._

__extend__ - _Gbone.Stage.extend(properties, classProperties)_ - Create a custom `Gbone.Stage` class of your own by extending `Gbone.Stage` with instance `properties` as well as optional `classProperties`.

      var GlobalStage = Gbone.Stage.extend({
        
        initialize: function() {...},
        
        skeleton: _.template('...'),
        
        render: function() {...}
      });

__constructor / initialize__ - _new Gbone.Stage(options)_ - When creating a new `Gbone.Stage`, the options you pass in are attached to the Stage as `this.options`.  There are some Stage specific options that will be attached directly to the Stage instance: `name` and `router`.

      new GlobalStage({
        name: 'global-stage',
        router: router,
        el: 'body'
      });

__name__ - _stage.name_ - Name of the Stage.   If one is not provided as an `options` property during initialization, it will be created automatically in the format `stage-:num`, where `num` is a unique number.  Used primarily for setting up the routes for the Panels.

__skeleton__ - _stage.skeleton_ - The html skeleton template to be used by the Stage.  It's important that the class `viewport` be set in an element in the skeleton; this element will be used by the Stage to append its Panel views.

__router__ - _stage.router_ -  This Router contains all the routes for the Panels managed by the Stage.  When instantiating a Stage, pass in the `Backbone.Router` as an `options` property.  Note that if you don't pass one in, one will be created for the Stage during initialization.

A Panel's route will be of the following format:

      /stage_name/panel_name/trans-:trans

where `stage_name` is the Stage's name, `panel_name` is the Panel's name and `:trans` is the name of the transition effect.  If the last part; the `trans-:trans` is left out, the transition used will be the default, which is just showing/hiding the Panel.

An example of calling a Panel with name `panel-1` that is under the Stage with name `stage-1` and uses the `left` transition effect (sliding in from left) would be:

      /stage-1/panel-1/trans-left

Note that any deactivating Panels will automatically use the reverse of this transition, i.e. sliding out to right.

__add__ - _stage.add(panel1, panel2, ...)_ - Add any number of Panels to this Stage.  Automatically calls `stage.append(panels...)` to append the Panels to the Stage's `viewport` element.

      stage.add(panel1);
      stage.add(panel2, panel3, panel4);

__getPanel__ - _stage.getPanel(name)_ - Retrieve a Panel with a name of `name` in this Stage (if any).

__bindTo__ - _stage.bindTo(source, event, callback)_ - On top of binding `event` to `source`, keeps track of all the event handlers that are bound.  A single call to `unbindFromAll()` will unbind them.

__unbindFromAll__ - _stage.unbindFromAll()_ - Unbind all events.

__cleanup__ - _stage.cleanup()_ - Cleanup the Stage.  Unbind all events (DOM, Model/Collection and View) and remove the Stage from the DOM and it's parent if needed.

__appendChild__ - _stage.appendChild(view)_ - Append a child View to this Stage.

__appendChildInto__ - _stage.appendChildInto(view, container)_ - Append a child View to a container element within this Stage.

      stage.appendChildInto(view, 'viewport');

__removeChild__ - _stage.removeChild(view)_ - Remove the given child View from the Stage.

__removeFromParent__ - _stage.removeFromParent()_ - Remove the Stage from its parent.

## Gbone.Panel

As mentioned before, Panels are contained within Stages.  A single Stage can have multiple Panels that are managed by that Stage's internal Panel manager.  Each Panel of the Stage can be transitioned in and out but only one can be shown at a time.

A Panel is appended into it's Stage's element with class `viewport`.  Like a Stage, it also has a default html skeleton template that can be overridden when extending `Gbone.Panel`.

Default Panel skeleton:

      <div class="container">
        <header></header>
        <article></article>
      </div>
  
A Panel with it's skeleton rendered inside it's `el`:

      <div class="panel">
        <div class="container">
          <header></header>
          <article></article>
        </div>
      </div>

The above will get appended into the Stage's `.viewport` element.

### Properties and methods of Gbone.Panel

_Note: Since `Gbone.Panel` extends `Backbone.View`, these are additional methods and properties provided on top of the ones provided by `Backbone.View`.  However, some properties and methods of `Backbone.View` may be mentioned here as well if needed._

__extend__ - _Gbone.Panel.extend(properties, classProperties)_ - Create a custom Gbone.Panel class of your own by extending `Gbone.Panel` with instance _properties_ as well as optional _classProperties_.

      var GlobalPanel = Gbone.Panel.extend({
        
        initialize: function() {...},
        
        skeleton: _.template('...'),
        
        render: function() {...}
      });

__constructor / initialize__ - _new Gbone.Panel(options)_ - When creating a new Gbone.Panel, the options you pass in are attached to the Panel as `this.options`.  There are several Panel specific options that will be attached directly to the Panel instance: `name` and `stage`.

      new GlobalPanel({
        name: 'panel1',
        stage: stage
      });

__name__ - _panel.name_ - Name of the Panel.   If one is not provided as an `options` property during initialization, it will be created automatically in the format `panel-:num`, where `num` is a unique number.  Used primarily for setting up the route for the Panel.

__stage__ - _panel.stage_ - The Panel's Stage.  Providing this as part of the `options` in the constructor automatically adds this Panel to the Stage.

__skeleton__ - _panel.skeleton_ - The html skeleton template to be used by the Panel.  The default can be overridden when extending the Panel.

__routePanel__ - _panel.routePanel(callback)_ - Setup the routing for the Panel.  The callback gets called after the routing happens.  The route for a Panel is as follows: `/stage_name/panel_name/trans-:trans` where `trans-:trans` is optional and is used to set the transition effect.  Within the callback you should activate the Panel by calling the `active` method on it and/or `render` etc...

__effects / reverseEffects__ - _panel.effects / panel.reverseEffects_ - The `effects` object contains the activating transition effects and `reverseEffects` contains the deactivating effects.  See the Transitions section below for more details.

__transitionBindings__ - _panel.transitionBindings_ - The default element(s) in the Panel to animate for the transitions.  An array of elements/selectors of the form `['.header', '.container', '.footer', ...]`.  Each element/selector in the `transitionBindings` array represents a child DOM element within the Panel that is to be animated.  If `transitionBindings` is not overridden, the default child element that will be animated in the Panel View is `.container`.

__addTransition__ - _pane.addTransition(transition)_ - Add a new transition.  The `transition` argument is an object as follows: `transition.effects` - Object that contains the activation transitions to be added.  `transition.reverseEffects` - Object that contains the deactivation transitions.

      {
        effects: {
          up: function (callback) {
            ...
          }
        },
        
        reverseEffects: {
          up: function (callback) {
            
          }
        }
      }

__active__ - _panel.active([*args])_ - Trigger the `active` event to activate this Panel.  Arguments will be passed along to the `active` event callbacks.  The `activated` event will be triggered once activation is complete and the `deactivated` event will be triggered once deactivation is complete.  To pass in the transition effect to use (`left` transition for example): `panel.active({trans:'left'})`.

__isActive__ - _panel.isActive()_ - Returns true if the Panel is the active one.

__bindTo__ - _panel.bindTo(source, event, callback)_ - On top of binding `event` to `source`, keeps track of all the event handlers that are bound.  A single call to `unbindFromAll()` will unbind them.

__unbindFromAll__ - _panel.unbindFromAll()_ - Unbind all events.

__cleanup__ - _panel.cleanup()_ - Cleanup the Panel.  Unbind all events (DOM, Model/Collection and View) and remove the Panel from the DOM and it's parent if needed.

__appendChild__ - _panel.appendChild(view)_ - Append a child View to this Panel.

__appendChildInto__ - _panel.appendChildInto(view, container)_ - Append a child View to a container element within this Panel.

      panel.appendChildInto(view, 'viewport');

__removeChild__ - _panel.removeChild(view)_ - Remove the given child View from the Panel.

__removeFromParent__ - _panel.removeFromParent()_ - Remove the Panel from its parent.

## Transitions

Transitions are used when a Panel is activated/deactivated (since only one Stage and Panel are visible at any one time).  These transitions between Panels are handled using CSS transforms.  The advantage of using CSS transforms is that the transitions are hardware accelerated, thus improving performance on mobile devices.  Some default transitions are provided, you can add more using the `addTransition` method of the Panel.  If jQuery is used, the default transitions are done using [GFX](http://maccman.github.com/gfx/), or if Zepto is used, it's done by [Zepto-GFX](https://github.com/gobhi/zepto-gfx).

As mentioned above, you can add your own transitions by using the `addTransition` method of a Panel.  When defining a transition it must have a definition under `effects` and `reverseEffects`.  The `reverseEffects` object contains the deactivating transition effects for the effects in the `effects` object. i.e. the `left` effect in the `effects` object is for sliding in from the left and the `left` effect in the `reverseEffects` object is for sliding out to the right.

The transitions must also take in an optional callback function as an argument that must be called when the transition is complete.  You should view the Transitions module in the `gbone.js` source and use it as a guide if writing your own.  You can also look at the transitions in the demo app provided in `up_down.js` under _example/app/helpers/transitions/_ 

When a transition effect is used, it animates the elements in the Panel provided by the `transitionBindings` array.  This is an array of elements/selectors of the form `['.header', '.container', '.footer', ...]`.  Each element/selector in the `transitionBindings` array represents a child DOM element within the Panel that is to be animated.  If `transitionBindings` is not overridden, the default child element that will be animated in the Panel View is `.container`.

## CSS

The `index.css ` file located under _example/app/public/css_ in the provided demo application is a great example of how to layout the css for Stages and Panels.  This layout works well with GFX and Zepto-GFX.

The css in the demo application is just one way of doing it.  It is mainly up to you to style your application so that it works with Gbone.

## Demo application

The demo application (found under the _example_ directory) is a re-write of the [currency.io](https://github.com/benschwarz/currency.io) web application using Gbone.

Among other things, it demonstrates one way of setting up the application layout with CSS.  Most of the application specific styling for the demo application was taken from the Spine.Mobile version of currency.io: https://github.com/maccman/spine.mobile.currency.

## To do

- Package up Gbone.js into an NPM package.

## License

Gbone.js is licensed under the terms of the MIT License, see the included LICENSE file.
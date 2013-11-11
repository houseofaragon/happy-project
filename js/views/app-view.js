/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	app.AppView = Backbone.View.extend({
		// bind to todoapp section
		el: '#todoapp',
		// bind to stats-template section
		statsTemplate: _.template($('stats-template').html()),

		events:{
			'keypress #new-todo': 'createOnEnter',
			'click #clearCompleted': 'clearCompleted',
			'click #toggle-all': 'toggleAllComplete'
		},

		initialize: function(){
			this.allCheckbox = this.$('#toggle=all')[0];
			this.$input = this.$('#new-todo');
			this.$footer = this.$('#footer');
			this.$main = this.$('#main');

			this.listenTo(app.Todos, 'add', this.addOne);
			this.listenTo(app.Todos, 'reset', this.addAll);
			// New
	      	this.listenTo(app.Todos, 'change:completed', this.filterOne);
	      	this.listenTo(app.Todos,'filter', this.filterAll);
	      	this.listenTo(app.Todos, 'all', this.render);

	      	app.Todos.fetch();
		},

		render: function() {
	      var completed = app.Todos.completed().length;
	      var remaining = app.Todos.remaining().length;

	      if ( app.Todos.length ) {
	        this.$main.show();
	        this.$footer.show();

	        this.$footer.html(this.statsTemplate({
	          completed: completed,
	          remaining: remaining
	        }));

	        this.$('#filters li a')
	          .removeClass('selected')
	          .filter('[href="#/' + ( app.TodoFilter || '' ) + '"]')
	          .addClass('selected');
	      } else {
	        this.$main.hide();
	        this.$footer.hide();
	      }

	      this.allCheckbox.checked = !remaining;
	    },




		addOne: function(todo){
			var view = new app.TodoView({model:todo});
			$('#todo-list').append(view.render().el);
		},

		addAll: function(){
			this.$('#todo-list').html('');
			app.Todos.each(this.addOne,this);
		},

		filterOne: function(todo){
			todo.trigger('visible');
		},

		filterAll: function(){
			app.Todos.each(this.filterOne, this);
		},

		newAttributes: function(){
			return{
				title: this.$input.val().trim(),
				order: app.Todos.nextOrder(),
				completed: false
			};
		},

		// New
	    // If you hit return in the main input field, create new Todo model,
	    // persisting it to localStorage.
	    createOnEnter: function( event ) {
	      if ( event.which !== ENTER_KEY || !this.$input.val().trim() ) {
	        return;
	      }

	      app.Todos.create( this.newAttributes() );
	      this.$input.val('');
	    },

	    // New
	    // Clear all completed todo items, destroying their models.
	    clearCompleted: function() {
	      _.invoke(app.Todos.completed(), 'destroy');
	      return false;
	    },

	    // New
	    toggleAllComplete: function() {
	      var completed = this.allCheckbox.checked;

	      app.Todos.each(function( todo ) {
	        todo.save({
	          'completed': completed
	        });
	      });
	    }
}
})(jQuery);














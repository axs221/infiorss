// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'backbone.localStorage',
    'app'
], function($, _, Backbone, app) {

    app.AppView = Backbone.View.extend({
        el: '#readerapp',
        initialize: function() {
            this.input = this.$('#new-feed');
            app.feedList.on('add', this.addOne, this);
            app.feedList.on('reset', this.addAll, this);
            app.feedList.fetch(); // Load from local storage

            app.articlesView.displayArticles();
        },
        events: {
            'keypress #new-feed': 'createFeedOnEnter'
        },
        createFeedOnEnter: function(e) {
            var enter_key = 13;
            if (e.which !== enter_key) {
                return;
            }
            app.feedList.create({
                uri: this.input.val().trim()
            });
            this.input.val(''); // Clear the input box
        },
        addOne: function(feed) {
            var view = new app.FeedView({
                model: feed
            });

            if (feed.attributes.title === '') {
                feed.fetchTitle(function(feed) {
                    $('#feed-list').append(view.render().el);
                });
            } else {
                $('#feed-list').append(view.render().el);
            }
        },
        addAll: function() {
            this.$('#feed-list').html('');
            app.feedList.each(this.addOne, this);
        }
    });

    app.appView = new app.AppView();
});

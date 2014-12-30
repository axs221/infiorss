'use strict'

define([
    'jquery',
    'underscore',
    'backbone',
    'backbone.localStorage',
    'app'
], function($, _, Backbone, app) {

    app.Feed = Backbone.Model.extend({
        initialize: function() {
            // Try to use the main domain if possible, since subdomains often don't have favicons.
            var domainMatch = this.attributes.uri.match(/\.([a-z0-9]+\.)?[a-z0-9]*\.[a-z]{2,6}/i);
            if (domainMatch !== null && domainMatch.length > 0) {
                this.attributes.favicon = "http://www.google.com/s2/favicons?domain_url=http://www" + this.attributes.uri.match(/\.([a-z0-9]+\.)?[a-z0-9]*\.[a-z]{2,6}/i)[0]
            } else {
                this.attributes.favicon = "http://www.google.com/s2/favicons?domain_url=http://www" + this.attributes.uri
            }
        },
        defaults: {
            favicon: '',
            uri: '',
            title: ''
        },
        fetchTitle: function(callback) {
            if (this.get('title') !== '') {
                return;
            }

            var me = this;
            var uri = this.get('uri');
            $.ajax({
                caller: this,
                callback: callback,
                url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(this.get('uri')),
                dataType: 'json',
                success: function(data) {
                    if (data.responseData !== null) {
                        this.caller.attributes.title = data.responseData.feed.title;
                        this.caller.save();
                    }
                    this.callback(this.caller);
                }
            });
        }
    });

    app.FeedList = Backbone.Collection.extend({
        model: app.Feed,
        localStorage: new Backbone.LocalStorage("backbone-infiorss")
    });
    app.feedList = new app.FeedList();

    app.FeedView = Backbone.View.extend({
        tagName: 'span',
        template: _.template($('#feed-template').html()),
        initialize: function() {
            app.feedList.on('add', this.addOne, this);

        },
        addOne: function() {
            app.articlesView.displayArticles();
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var feed;

    var view = new app.FeedView({
        model: feed
    });
    
});

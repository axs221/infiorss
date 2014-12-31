// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'backbone.localStorage',
    'app'
], function($, _, Backbone, app) {

    app.Article = Backbone.Model.extend({
        defaults: {
            favicon: '',
            feed: '',
            link: '',
            title: '',
            content: ''
        }
    });

    app.ArticleList = Backbone.Collection.extend({
        model: app.Article,
        // TODO- why does this require local storage?
        localStorage: new Store("backbone-infiorss-articles")
    });

    app.articleList = new app.ArticleList();

    var articlesViewInitialized = false;
    app.ArticlesView = Backbone.View.extend({
        tagName: 'span',
        template: _.template($('#article-template').html()),
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        initialize: function() {
            // TODO: Not the best solution, this code should maybe be moved to the AppView like feeds are. But it seems like that is poluting AppView.
            if (!articlesViewInitialized) {
                app.articleList.on('add', this.addOne, this);
                app.articleList.on('reset', this.addAll, this);
                articlesViewInitialized = true;
            }
        },
        addOne: function(article) {
            // TODO: do we really need a new view? It runs initialize again each time, so I had to add an init bool to make sure events are only registered once.
            var view = new app.ArticlesView({
                model: article
            });
            $('#articles-view').append(view.render().el);
        },
        addAll: function() {
            this.$('#articles-view').html('');
            app.articleList.each(this.addOne, this);
        },
        isDisplayingArticles: false,
        redisplayArticles: false,
        displayArticles: function() {
            if (app.feedList.length === 0) {
                return; 
            }
            
            if (this.isDisplayingArticles) {
                this.redisplayArticles = true;
                return;
            }
            this.isDisplayingArticles = true;
            $('#articles-view').html('');

            // If we are refreshing, we are going to recount all of the tags, set them to 0 first to recount
            app.tagList.each(function(model) {
                model.attributes.count = 0
            });


            for (var i = 0; i < app.feedList.length; i++) {
                var feed = app.feedList.at(i);
                this.feedCount = app.feedList.length;

                this.getRss(feed, this, (function(data, feed, caller) {
                    var articlesToLoadPerFeed = Math.max(1, Math.min(data.entries.length, 21-caller.feedCount))
                    for (var i = 0; i < articlesToLoadPerFeed; i++) {
                        var entry = data.entries[i];

                        var isTagSelected = false;
                        var isFilteredOut = false;

                        for (var j = 0; j < app.tagList.length; j++) {
                            var tag = app.tagList.at(j);

                            if (tag.get('selected')) {
                                isTagSelected = true;

                                if (entry.title.indexOf(tag.get('tag')) === -1) {
                                    isFilteredOut = true;
                                }
                            }
                        };

                        if (isTagSelected && isFilteredOut) {
                            continue;
                        }
                        app.articleList.create({
                            favicon: feed.attributes.favicon,
                            feed: feed.attributes.title,
                            title: entry.title,
                            link: entry.link,
                            content: entry.content
                        });

                        app.tagView.parseTags(entry);
                        //TODO - shouldn't run every feed, but a pain because it uses callbacks
                    };
                    app.tagView.displayTags();
                    caller.isDisplayingArticles = false;

                    if (caller.redisplayArticles) {
                        // Refresh needed, new feed may have been added
                        caller.redisplayArticles = false;
                        caller.displayArticles();
                    }
                }));
            };

        },
        getRss: function(feed, caller, callback) {
            $.ajax({
                url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(feed.attributes.uri),
                dataType: 'json',
                feed: feed,
                success: function(data) {
                    if (data !== null && data.responseData != null) {
                        callback(data.responseData.feed, feed, caller);
                    }
                }
            });
        }
    });

    app.articlesView = new app.ArticlesView();
});

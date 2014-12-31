// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'backbone.localStorage',
    'app'
], function($, _, Backbone, app) {
    app.Tag = Backbone.Model.extend({
        defaults: {
            tag: '',
            count: 1,
            selected: false,
            checked: '' // Text "checked" to embed in HTML
        },
        checked: function() {
            return this.get('selected') === true
        }
    });

    // Tags are temporary, override so you don't have to save to local storage or via Rest
    app.Tag.prototype.sync = function() {
        return null;
    };
    app.Tag.prototype.fetch = function() {
        return null;
    };
    app.Tag.prototype.save = function() {
        return null;
    };

    app.TagList = Backbone.Collection.extend({
        model: app.Tag,
        // localStorage: new Store("backbone-infiorss-tags")
    });


    app.tagList = new app.TagList();

    app.TagView = Backbone.View.extend({
        template: _.template($('#tag-template').html()),
        tagName: 'span',
        events: {
            'click [type="checkbox"]': 'clicked',
        },
        clicked: function(event) {

            if (this.model.attributes.selected) {
                this.model.attributes.selected = false;
                this.model.attributes.checked = '';
            } else {
                this.model.attributes.selected = true;
                this.model.attributes.checked = 'checked';
            }
            app.articlesView.displayArticles();
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        parseTags: function(article) {
            var contentWords = article.title.split(' ');


            for (var i = 0; i < contentWords.length; i++) {
                var word = contentWords[i];
                word = word.replace(/<(?:.|\n)*?>/gm, ''); // HTML tags
                word = word.replace(/(?!\w)[\x00-\xC0]$/g, ''); // Non-word characters from end, like periods
                var existingTag = app.tagList.find(function(model) {
                    return model.get('tag') == word
                })
                if (word.length < 30
                        && !app.isCommonWord(word)) {
                    if (!existingTag) {
                        app.tagList.create({
                            tag: word
                        });
                    } else {
                        existingTag.attributes.count += 1;
                        existingTag.save();
                    }
                }
            };
        },
        displayTags: function() {
            // $('#tag-list').html(''); // TODO - save this and generate only once
            $('#tags-view').html('');
            var sortedTags = app.tagList.sortBy(function(tag) { return -tag.attributes.count });
            var totalTags = Math.min(sortedTags.length, 38);
            for (var i = 0; i < totalTags; i++) {
                var tag = sortedTags[i];

                if (tag.get('selected') ||
                    (tag.get('count') > 0 && tag.get('tag').length > 3 && tag.get('tag').indexOf('<') === -1)  && tag.get('tag').indexOf('"') === -1 && !tag.get('tag').match(/[^a-zA-Z]/)) { // TODO - make a dictionary of common words to filter out, not just by length
                    var view = new app.TagView({
                        model: tag
                    });
                    $('#tags-view').append(view.render().el);
                }
            };
        }
    });

    app.tagView = new app.TagView();

});

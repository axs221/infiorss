'use strict'

define([
    'jquery',
    'underscore',
    'backbone',
    'backbone.localStorage',
    'app',
    '../templates/compiled-templates',
    'handlebars.runtime'
], function($, _, Backbone, app, Templates, Handlebars) {

    app.ArticlePaginatorView = Backbone.View.extend({
        el: '#articlepaginator-view',
        tagName: 'span',
        template: Handlebars['articlepaginator-template.hbs'],
        events: {
            "click .article-page": "moveToPage",
        },
        pageCount: 0,
        initialize: function() {
            app.articleList.on('add', this.addOne, this);
        },
        addOne: function() {
            if (this.pageCount < app.Paginator.currentPage) {
                this.pageCount = this.pageCount + 1;
                this.render();
            }
        },
        render: function() {
            $('#articlepaginator-view').append(this.template({ page: this.pageCount }));
            return this;
        },
        moveToPage: function(e) {
            var page = $(e.currentTarget).data("id");
            app.Paginator.myPage = page;
            app.articlesView.renderCurrentPage();
        }
    });

    var article;

    var view = new app.ArticlePaginatorView({
        model: article
    });
    
});

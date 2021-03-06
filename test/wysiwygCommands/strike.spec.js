'use strict';

var Strike = require('../../src/js/wysiwygCommands/strike'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    EventManager = require('../../src/js/eventManager');

describe('Strike', function() {
    var wwe;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    it('add Strike to current selection', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('line1<br />line2');

        range.selectNodeContents(wwe.get$Body().children()[0]);
        wwe.getEditor().setSelection(range);

        Strike.exec(wwe);

        expect(wwe.getValue()).toEqual('<s>line1</s><br />line2<br />');
    });

    it('dont add Strike in Achor tag', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('<a href="#">line1</a>');

        range.selectNodeContents(wwe.get$Body().find('a')[0]);
        wwe.getEditor().setSelection(range);

        Strike.exec(wwe);

        expect(wwe.getValue()).toEqual('<a href="#">line1</a><br />');
    });

    it('dont add Strike in PRE tag', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('<pre>line1</pre>');

        range.selectNodeContents(wwe.get$Body().find('pre')[0]);
        wwe.getEditor().setSelection(range);

        Strike.exec(wwe);

        expect(wwe.getValue()).toEqual('<pre>line1</pre><br />');
    });

    it('if there have Strike already remove format', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('line1<br />line2');

        range.selectNodeContents(wwe.get$Body().children()[0]);
        wwe.getEditor().setSelection(range);

        Strike.exec(wwe);
        Strike.exec(wwe);

        expect(wwe.getValue()).toEqual('line1<br />line2<br />');
    });

    it('if there have Strike already remove format in colappsed selection', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('<s>line</s>');

        range.setStart(wwe.get$Body().find('s')[0].firstChild, 4);
        range.collapse(true);
        wwe.getEditor().setSelection(range);

        Strike.exec(wwe);
        wwe.getEditor().insertPlainText('a');

        expect(wwe.getValue()).toEqual('<s>line</s>a<br />');
    });

    it('if there have italic apply Strike into italic', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('<i>line</i>');

        range.selectNodeContents(wwe.get$Body().children()[0]);
        wwe.getEditor().setSelection(range);

        Strike.exec(wwe);

        expect(wwe.getValue()).toEqual('<i><s>line</s></i><br />');
    });

    it('if there have italic apply Strike into bold', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('<b>line</b>');

        range.selectNodeContents(wwe.get$Body().children()[0]);
        wwe.getEditor().setSelection(range);

        Strike.exec(wwe);

        expect(wwe.getValue()).toEqual('<b><s>line</s></b><br />');
    });

    it('if there have italic apply Strike into bold and italic', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('<b><i>line</i></b>');

        range.selectNodeContents(wwe.get$Body().children()[0]);
        wwe.getEditor().setSelection(range);

        Strike.exec(wwe);

        expect(wwe.getValue()).toEqual('<b><i><s>line</s></i></b><br />');
    });

    it('if there have code remove and add Strike', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('<code>line</code>');

        range.selectNodeContents(wwe.get$Body().children()[0]);
        wwe.getEditor().setSelection(range);

        Strike.exec(wwe);

        expect(wwe.getValue()).toEqual('<s>line</s><br />');
    });
});

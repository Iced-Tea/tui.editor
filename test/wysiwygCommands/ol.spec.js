'use strict';

var OL = require('../../src/js/wysiwygCommands/ol'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    WwTaskManager = require('../../src/js/wwTaskManager'),
    EventManager = require('../../src/js/eventManager');

describe('OL', function() {
    var wwe, sq;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();

        sq = wwe.getEditor();
        wwe.addManager('task', WwTaskManager);
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    it('add OL', function() {
        OL.exec(wwe);

        expect(wwe.get$Body().find('ol').length).toEqual(1);
        expect(wwe.get$Body().find('li').length).toEqual(1);
    });

    it('if have task in range then remove task and change to ul', function() {
        var range = sq.getSelection().cloneRange();

        sq.setHTML('<ul><li class="task-list-item"><div><input type="checkbox"> test</div></li></ul>');

        range.setStart(wwe.get$Body().find('li')[0], 1);
        range.collapse(true);

        sq.setSelection(range);

        OL.exec(wwe);

        expect(wwe.get$Body().find('.task-list-item').length).toEqual(0);
        expect(wwe.get$Body().find('ol').length).toEqual(1);
        expect(wwe.get$Body().find('li').length).toEqual(1);
        expect(wwe.get$Body().find('li').text()).toEqual('test');
        expect(wwe.get$Body().find('input').length).toEqual(0);
    });
});

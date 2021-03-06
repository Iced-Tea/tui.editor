'use strict';

var TuiEditor = require('../../src/js/editor'),
    ScrollSync = require('../../src/js/extensions/scrollFollow.scrollSync'),
    SectionManager = require('../../src/js/extensions/scrollFollow.sectionManager');

var loadStyleFixtures = window.loadStyleFixtures;

describe('scrollFollow.ScrollSync', function() {
    var ned, sectionManager, scrollSync;

    beforeEach(function() {
        jasmine.getStyleFixtures().fixturesPath = '/base';
        loadStyleFixtures('lib/codemirror/lib/codemirror.css');
        $('body').html('<div id="editSection"></div>');

        ned = new TuiEditor({
            el: $('#editSection'),
            previewStyle: 'vertical',
            height: 100,
            initialEditType: 'markdown',
            events: {
                'load': function(editor) {
                    editor.getCodeMirror().setSize(200, 50);
                    $('.te-preview').css('padding', '0');
                    $('.te-preview').css('overflow', 'auto');
                    sectionManager = new SectionManager(editor.getCodeMirror(), editor.preview);
                    scrollSync = new ScrollSync(sectionManager, editor.getCodeMirror(), editor.preview.$el);
                }
            }
        });
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    describe('get scroll data for preview from markdown', function() {
        beforeEach(function() {
            ned.setValue([
                    'paragraph',
                    '# header1',
                    'paragraph',
                    'paragraph',
                    'paragraph',
                    '## header2',
                    'paragraph',
                    'paragraph',
                    'paragraph',
                    'paragraph',
                    'paragraph',
                    'paragraph',
                    'paragraph'
            ].join('\n'));

            sectionManager.makeSectionList();
        });

        it('get section by markdown scroll top', function() {
            var cm = ned.getCodeMirror(),
            scrollFactors;

            cm.scrollTo(0, Math.ceil(cm.heightAtLine(1, 'local')));

            scrollFactors = scrollSync._getScrollFactorsOfEditor();

            expect(scrollFactors.section.end).toEqual(4);
            expect(scrollFactors.sectionRatio).not.toEqual(0);
        });

        it('if editor scroll to bottom then return isEditorBottom === true ', function() {
            var cm = ned.getCodeMirror(),
            scrollFactors;

            cm.scrollTo(0, cm.heightAtLine(12, 'local'));

            scrollFactors = scrollSync._getScrollFactorsOfEditor();

            expect(scrollFactors.isEditorBottom).toBe(true);
        });
    });

    describe('running animation', function() {
        it('call step callback function', function() {
            var stepCallback = jasmine.createSpy('stepCallback');
            scrollSync._animateRun(0, 10, stepCallback);

            expect(stepCallback).toHaveBeenCalled();
        });

        it('value', function(done) {
            var values = [];

            scrollSync._animateRun(0, 100, function(value) {
                values.push(value);

                if (value === 100) {
                    expect(values.length).toBeGreaterThan(1);
                    done();
                }
            });
        });
    });

    describe('sync preview scroll by markdown scroll top', function() {
        it('get preview scrollTop that synced with markdown scroll top', function(done) {
            var cm = ned.getCodeMirror(),
                previewScrollTop;

            ned.setValue([
                    'paragraph',
                    '# header1',
                    'paragraph',
                    'paragraph',
                    '## header2',
                    'paragraph'
            ].join('\n'));

            sectionManager.makeSectionList();

            previewScrollTop = scrollSync.$previewContainerEl.scrollTop();

            ned.on('previewRenderAfter', function() {
                sectionManager.sectionMatch();
                cm.scrollTo(0, cm.heightAtLine(3, 'local'));

                scrollSync.syncToPreview();

                expect(scrollSync.$previewContainerEl.scrollTop()).not.toEqual(previewScrollTop);

                done();
            });
        });

        it('if scroll factors have something wrong, dont scroll control', function(done) {
            var cm = ned.getCodeMirror(),
                previewScrollTop;

            ned.setValue([
                    'paragraph',
                    '# header1',
                    'paragraph',
                    'paragraph',
                    '## header2',
                    'paragraph'
            ].join('\n'));

            sectionManager.makeSectionList();

            previewScrollTop = scrollSync.$previewContainerEl.scrollTop();

            ned.on('previewRenderAfter', function() {
                sectionManager.sectionMatch();

                sectionManager.getSectionList().forEach(function(section) {
                    section.$previewSectionEl = null;
                });

                cm.scrollTo(0, cm.heightAtLine(1, 'local'));

                scrollSync.syncToPreview();

                expect(scrollSync.$previewContainerEl.scrollTop()).toEqual(previewScrollTop);

                done();
            });
        });
    });
});

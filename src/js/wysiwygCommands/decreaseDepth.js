/**
 * @fileoverview Implements incease depth wysiwyg command
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * DecreaseDepth
 * decrease depth of list or task to wysiwyg Editor
 * @exports IncreaseDepth
 * @augments Command
 * @augments WysiwygCommand
 */
var DecreaseDepth = CommandManager.command('wysiwyg', /** @lends HR */{
    name: 'DecreaseDepth',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WysiwygEditor instance
     */
    exec: function(wwe) {
        var $node, nodeClasses, $input;
        var range = wwe.getEditor().getSelection();
        var isInTaskList = wwe.getManager('task').isInTaskList(range);
        // IE10 에서 task의 startOffset에 ZWB를 가산하는 문제때문에,
        // list 일때 depth 커서위치 1에서의 depth 이동을 제한하기 위해 사용
        var isOffsetEuqals2InDIVForIE10 = (range.startContainer.tagName === 'DIV' && range.startOffset === 2);

        $node = $(range.startContainer).closest('li');
        $input = $($node.find('input:checkbox')[0]);
        if ((isInTaskList && range.startOffset <= 1)
            || isOffsetEuqals2InDIVForIE10
            || range.startOffset === 0
        ) {
            wwe.getEditor().recordUndoState(range);

            nodeClasses = $node.attr('class');
            $node.removeAttr('class');

            wwe.getEditor().decreaseListLevel();

            if ($input.length && ($input.parents('ol,ul').length === 0
                || $input.parents('li').length === 0
                || !$input.parents('li').hasClass('task-list-item'))
            ) {
                $input.remove();
            } else {
                range = wwe.getEditor().getSelection().cloneRange();
                $node = $(range.startContainer).closest('li');

                if (nodeClasses) {
                    $node.attr('class', nodeClasses);
                } else {
                    $node.removeAttr('class');
                }
            }
        }
    }
});

module.exports = DecreaseDepth;

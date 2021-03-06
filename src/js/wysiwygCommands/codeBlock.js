/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var codeBlockID = 0,
    CODEBLOCK_CLASS_PREFIX = 'te-content-codeblock-';
/**
 * CodeBlock
 * Add CodeBlock to wysiwygEditor
 * @exports CodeBlock
 * @augments Command
 * @augments WysiwygCommand
 */
var CodeBlock = CommandManager.command('wysiwyg', /** @lends CodeBlock */{
    name: 'CodeBlock',
    keyMap: ['SHIFT+CTRL+P', 'SHIFT+CTRL+P'],
    /**
     * Command handler
     * @param {WysiwygEditor} wwe WYsiwygEditor instance
     * @param {string} type of language
     */
    exec: function(wwe, type) {
        var sq = wwe.getEditor(),
            attr;

        if (!sq.hasFormat('PRE')) {
            attr = ' class = "' + CODEBLOCK_CLASS_PREFIX + codeBlockID + '"';

            if (type) {
                attr += ' data-language="' + type + '"';
            }

            sq.insertHTML('<pre' + attr + '><div><code>&#8203</code><br></div></pre>');

            focusToFirstCode(wwe.get$Body().find('.' + CODEBLOCK_CLASS_PREFIX + codeBlockID), wwe);

            codeBlockID += 1;
        }

        sq.focus();
    }
});

/**
 * focusToFirstCode
 * Focus to first code tag content of pre tag
 * @param {jQuery} $pre pre tag
 * @param {WysiwygEditor} wwe wysiwygEditor
 */
function focusToFirstCode($pre, wwe) {
    var range = wwe.getEditor().getSelection().cloneRange();

    range.setStart($pre.find('code')[0].firstChild, 0);
    range.collapse(true);

    wwe.getEditor().setSelection(range);
}

module.exports = CodeBlock;

/**
 * @fileoverview Implements PopupTableUtils
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var LayerPopup = require('./layerpopup');

var util = tui.util;

var POPUP_CONTENT = [
    '<button type="button" class="te-table-add-row">행 삽입</button>',
    '<button type="button" class="te-table-add-col">열 삽입</button>',
    '<button type="button" class="te-table-remove-row">행 삭제</button>',
    '<button type="button" class="te-table-remove-col">열 삭제</button>',
    '<button type="button" class="te-table-remove">표 삭제</button>'
].join('');

/**
 * PopupTableUtils
 * It implements table utils popup
 * @exports PopupTableUtils
 * @augments LayerPopup
 * @constructor
 * @class
 * @param {object} options options
 */
function PopupTableUtils(options) {
    options = util.extend({
        title: false,
        className: 'te-popup-table-utils',
        content: POPUP_CONTENT
    }, options);

    LayerPopup.call(this, options);

    this.eventManager = options.eventManager;

    this.render();
    this._bindContentEvent();
    this._linkWithEventManager();
}

PopupTableUtils.prototype = util.extend(
    {},
    LayerPopup.prototype
);

/**
 * _bindContentEvent
 * Bind element events
 */
PopupTableUtils.prototype._bindContentEvent = function() {
    var self = this;

    this.on('click .te-table-add-row', function() {
        self.eventManager.emit('command', 'AddRow');
    });

    this.on('click .te-table-add-col', function() {
        self.eventManager.emit('command', 'AddCol');
    });

    this.on('click .te-table-remove-row', function() {
        self.eventManager.emit('command', 'RemoveRow');
    });

    this.on('click .te-table-remove-col', function() {
        self.eventManager.emit('command', 'RemoveCol');
    });

    this.on('click .te-table-remove', function() {
        self.eventManager.emit('command', 'RemoveTable');
    });
};

/**
 * _linkWithEventManager
 * Bind event manager event
 */
PopupTableUtils.prototype._linkWithEventManager = function() {
    var self = this;

    this.eventManager.listen('focus', function() {
        self.hide();
    });

    this.eventManager.listen('mousedown', function() {
        self.hide();
    });

    this.eventManager.listen('openPopupTableUtils', function(event) {
        self.eventManager.emit('closeAllPopup');

        self.$el.css({
            'position': 'absolute',
            'top': event.layerY + 30,
            'left': event.layerX + 20
        });

        self.show();
    });

    this.eventManager.listen('closeAllPopup', function() {
        self.hide();
    });
};


module.exports = PopupTableUtils;

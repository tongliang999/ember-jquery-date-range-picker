/* jshint node: true */
'use strict';

module.exports = {
	name: 'ember-zbj-date-range-picker',

	included: function(app)
	{
		this._super.included(app);
		this.app.import('vendor/jquery.daterangepicker.js');
		this.app.import('vendor/daterangepicker.css');
	}
};

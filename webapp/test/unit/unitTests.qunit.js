/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comwakefern/zflexcl/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});

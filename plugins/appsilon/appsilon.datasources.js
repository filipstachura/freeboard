/*
  Appsilon freeboard plugins. Developed by Filip Stachura.
*/

(function () {

	var GoogleSheetsDatasource = function (settings, updateCallback) {
		var self = this;
		var updateTimer = null;
		var currentSettings = settings;

		function updateRefresh(refreshTime) {
			if (updateTimer) {
				clearInterval(updateTimer);
			}

			updateTimer = setInterval(function () {
				self.updateNow();
			}, refreshTime);
		}

		updateRefresh(currentSettings.refresh * 1000);

		this.updateNow = function () {
      sheetrock({
        url: currentSettings.url,
        reset: true,
        callback: function callback(error, options, response) {
					updateCallback(response);
        }
      });
    }

		this.onDispose = function () {
			clearInterval(updateTimer);
			updateTimer = null;
		}

		this.onSettingsChanged = function (newSettings) {
			currentSettings = newSettings;
			self.updateNow();
			updateRefresh(currentSettings.refresh * 1000);
		}
	};

	freeboard.loadDatasourcePlugin({
		type_name: "googlesheets",
		display_name: "Google sheets via sheetrock",
		settings: [
			{
				name: "url",
				display_name: "URL",
				type: "text",
				description: "URL to google sheet you want to connect"
			},
			{
				name: "refresh",
				display_name: "Refresh Every",
				type: "number",
				suffix: "seconds",
				default_value: 5
			}
		],
		newInstance: function (settings, newInstanceCallback, updateCallback) {
			newInstanceCallback(new GoogleSheetsDatasource(settings, updateCallback));
		}
	});
})();

module.exports = (config) => {
	const client = {
		_init: (config) => {
			client._config = config;

			return new Promise((resolve) => {
				resolve(client);
			});
		},
		_options: undefined,
	};

	return client._init(config);
};


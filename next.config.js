/** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig
module.exports = {
	webpack: (config, { isServer }) => {
		config.externals.push("pino-pretty", "lokijs", "encoding");

		if (!isServer) {
			config.resolve.alias.fs = "browserify-fs";
		}
		return config;
	},
};

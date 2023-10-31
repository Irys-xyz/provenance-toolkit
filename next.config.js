/** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig
module.exports = {
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.alias.fs = "browserify-fs";
		}
		return config;
	},
};

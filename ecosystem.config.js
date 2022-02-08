module.exports = {
  apps: [
    {
      name: 'capex-frontend-dev',
      cwd: '/home/pama/capex-dev/capex-frontend/',
      interpreter: '/home/pama/.nvm/versions/node/v14.17.5/bin/node',
      script: '/home/pama/.nvm/versions/node/v14.17.5/bin/npm',
      args: 'start',
      env: {
        PORT: 8080,
        NODE_ENV: 'development',
      },
    },
  ],
};

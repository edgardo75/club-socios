module.exports = {
  apps: [
    {
      name: 'club-backend',
      cwd: './backend',
      script: 'C:/Windows/System32/cmd.exe',
      args: '/c npm run dev',
      interpreter: 'none',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '512M',
      time: true,
    },
	{
      name: 'club-frontend',
      cwd: './frontend',
      script: 'C:/Windows/System32/cmd.exe',
      args: '/c npm run dev',
      interpreter: 'none',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '512M',
      time: true
    }
  ]
};


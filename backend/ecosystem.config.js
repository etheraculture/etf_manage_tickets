module.exports = {
  apps: [
    {
      name: 'ethera-backend-eft-26',
      script: 'npm',
      args: 'run dev',
      cwd: '/var/www/etf_atendance_manager/backend',
      env: {
        NODE_ENV: 'production',
        PORT: 3102
      },
      max_memory_restart: '500M',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true,
      watch: false
    },
    {
      name: 'ethera-frontend-eft-26',
      script: 'npx',
      args: 'vite preview --port 3103 --host',
      cwd: '/var/www/etf_atendance_manager/frontend',
      env: {
        NODE_ENV: 'production'
      },
      max_memory_restart: '300M',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true,
      watch: false
    }
  ]
};

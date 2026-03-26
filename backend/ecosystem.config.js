module.exports = {
  apps: [{
    name: 'ethera-backend-eft-26',
    script: 'npm',
    args: 'run dev',
    cwd: '/var/www/ethera-futuretalks/backend',
    env: {
      NODE_ENV: 'production',
      PORT: 3102
    },
    max_memory_restart: '500M',
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    merge_logs: true,
    watch: false
  }]
};

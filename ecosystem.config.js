module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    {
      name: 'scrapper',
      script: 'api.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '100M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000 // Cambia el puerto según tus necesidades
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user: 'ubuntu',
      host: '3.249.19.249',
      ref: 'origin/main',
      repo: 'git@github.com:marcosbermejo/scrapper.git',
      path: '/var/www/html/scrapper',
      key: '/home/marcos/ana.pem',
      ssh_options: ['ForwardAgent=yes'],
      'pre-deploy-local': `scp -i /home/marcos/ana.pem .env ubuntu@3.249.19.249:/var/www/html/scrapper/source`,
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    staging: {},
    dev : {}
  }
};
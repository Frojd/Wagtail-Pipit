# Publish storybook

Pipit includes Storybook out of the box as a development tool, but if you want to publish your Storybook to enable others to view your work in progress, follow this guide.

## Requirements
- You have performed application provisioning on both your stage and production environments by running the ansible playbook `provision.yml`

## Guide

1. Make sure `npm run build-storybook` runs in your `.circleci/config.yml` (this is enabled out of the box).

2. Open your Nginx configuration on stage and/or prod environment and uncomment this code (replace `my_project` with your project name):

```
vim /mnt/persist/etc/nginx/my_project.conf

# location /storybook/ {
#   auth_basic "Restricted";
#   auth_basic_user_file /mnt/persist/nginx/conf.d/.htpasswd;
#   alias /mnt/persist/www/my_project/current/src/frontend/storybook-static/;
# }
```

3. Reload nginx
```
service nginx reload
```

4. Now open your domain and to go /storybook/, here you should find your published storybook

5. Done!

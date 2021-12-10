# Animately Administration

Shared:

- Workflows
- Actions


### Workflows

`.github/workflows/build-deploy.yml`:

This builds the docker image (including buildkit secrets) and pushes the image to the DO Container Registry.
If `deploy_app_id` is provided, this app gets deployed on DO apps.

```yml
name: Deploy to staging

on: [workflow_dispatch]

jobs:
  build-and-deploy:
    uses: Animately/administration/.github/workflows/build-deploy.yml@main
    with:
      # name of the service to build and deploy
      name: blog
      
      # the environment, used for caching and tagging
      environment: staging
      
      # the app id to deploy (if not provided, the deploy-step is skipped)
      deploy_app_id: 9fcae70d0f83224280d06c0a3266065eb55cf1c
    secrets:
      # the digitalocean personal access token
      do_token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
      
      # secrets for docker buildkit
      # pass down secret environment variables that are needed during build time
      # use RUN --mount=type=secret,id=envs,dst=/run/envs command.sh in your Dockerfile
      envs: >
        BIT_AUTH_TOKEN=${{ secrets.BIT_AUTH_TOKEN }}
        FIREBASE_AUTH_TOKEN=${{ secrets.FIREBASE_AUTH_TOKEN }}
        SUPER_SECRET=${{ secrets.SUPER_SECRET }}
```

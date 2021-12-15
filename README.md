# Animately Administration

This repository contains administrative tools like workflows & actions that can be reused in other repositories.

## Workflows

### Build, push & deploy to DO apps

`.github/workflows/build-deploy.yml`:

This workflow builds the docker image (including buildkit secrets if needed) and pushes the image to the [DO Container Registry](https://registry.digitalocean.com/animately).
If `deploy_app_id` is provided, this app also gets redeployed.

Example usage:

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

### Update app spec

Each app in DO Apps has a spec file that contains the app's configuration. This workflow updates the spec file with the provided environment variables.

Example usage:

```yml
name: Update production spec

on: [workflow_dispatch]

jobs:
  sync-spec:
    uses: Animately/administration/.github/workflows/update-app-spec.yml@main
    with:
      # the app id to update 
      deploy_app_id: 9fcae70d0f83224280d06c0a3266065eb55cf1c
      
      # the service name to apply the config variables to
      service: blog
    secrets:
      # the digitalocean personal access token
      do_token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
      
      # set the environment variables
      variables: >
        {
          "server__host": {
            "value": "0.0.0.0",
            "type": "GENERAL"
          },
          "server__port": {
            "value": "5000",
            "type": "GENERAL"
          },
          "url": {
            "value": "https://animately.co/blog",
            "type": "GENERAL"
          },
          "super_secret": {
            "value": "${{ secrets.SUPER_SECRET }}",
            "type": "SECRET"
          }
        }

```

> See [DO Apps spec reference](https://docs.digitalocean.com/products/app-platform/references/app-specification-reference/) for more information.

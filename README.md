# Animately Workflows

Reusable workflows for Animately repositories.

### Build, push & deploy to DigitalOcean apps

`.github/workflows/build-deploy.yml`

This workflow builds the docker image (including buildkit secrets if needed) and pushes the image to the [DO Container Registry](https://registry.digitalocean.com/animately).
If `deploy_app_id` is provided, this app also gets redeployed.

```yml
jobs:
  build-and-deploy:
    uses: animately/action-workflows/.github/workflows/build-deploy.yml@main
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

Outputs:

```
deploy_id
```

### Update app spec on DigitalOcean

`.github/workflows/update-service-spec.yml`

Each app in DO Apps has a spec file that contains the app's configuration. 
This workflow updates the spec file with the provided environment variables.

```yml
jobs:
  sync-spec:
    uses: animately/action-workflows/.github/workflows/update-app-spec.yml@main
    with:
      # the app id to update 
      deploy_app_id: 9fcae70d0f83224280d06c0a3266065eb55cf1c
      
      # the service name to apply the config variables to
      service: blog
    secrets:
      # the digitalocean personal access token
      do_token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
      
      # set the service spec to update
      service_spec: |
        {
          "envs": [
            {
              "key": "FIREBASE_AUTH_TOKEN",
              "value": "${{ secrets.FIREBASE_AUTH_TOKEN }}",
              "type": "SECRET",
              "scope": "RUN_TIME"
            },
            {
              "key": "BASE_PATH",
              "value": "/blog",
              "type": "GENERAL",
              "scope": "RUN_TIME"
            }
          ]
        }

```

> See [DO Apps spec reference](https://docs.digitalocean.com/products/app-platform/references/app-specification-reference/) for more information.

### Create review app on DigitalOcean

`.github/workflows/create-review-app.yml`

This will create a new app on DO Apps and will deploy the specified component (service).

```yml
jobs:
  create-review:
    uses: animately/action-workflows/.github/workflows/create-review-app.yml@main
    with:
      # name of the app to create
      name: review-test-app
      
      # the service to deploy
      service: optimizer
      
      # extends to spec from this app
      base_app_id: 9fcae70d0f83224280d06c0a3266065eb55cf1c
    secrets:
      # the digitalocean personal access token
      do_token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
      
      # the service spec to use
      service_spec: >
        {
          "envs": [
            {
              "key": "OPTIMIZER_BASE",
              "value": "/optimize/",
              "type": "GENERAL",
              "scope": "RUN_TIME"
            }
          ],
          "image": {
            "registry_type": "DOCR",
            "repository": "optimizer",
            "tag": "review-test-app-v1"
          }
        }
```

Outputs:

```
review_app_id
review_url
```

### Destroy review app on DigitalOcean

`.github/workflows/destroy-review-app.yml`

This will delete the app from apps and remove the image from Container Registry. 

```yml
jobs:
  teardown:
    uses: animately/action-workflows/.github/workflows/destroy-review-app.yml@main
    with:
      # the app to destroy in DO apps
      deploy_app_id: review-test-app
      
      # the tag to delete from the Container Registry
      container_tag: review-test-app-v1
    secrets:
      # the digitalocean personal access token
      do_token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
```

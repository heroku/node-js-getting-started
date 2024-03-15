docker build -t test-app . --no-cache=true --platform=linux/amd64
docker tag test-app registry.heroku.com/wallarm-test-app/web
docker push registry.heroku.com/wallarm-test-app/web
heroku container:release web -a wallarm-test-app

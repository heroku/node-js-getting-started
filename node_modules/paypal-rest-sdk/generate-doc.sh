#!/bin/sh
# Documentation generation script run by travis

mkdir ../gh-pages

cp docs/conf.json node_modules/jsdoc/

# Generate Doc
grunt jsdoc

# Copy Home Page from Master Branch to Gh-Pages folder
cp -r docs/* ../gh-pages/

cd ../gh-pages

# Set identity
git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis"

# Add branch
git init
git remote add origin https://${GH_TOKEN}@github.com/paypal/PayPal-node-SDK.git > /dev/null
git checkout -B gh-pages

# Push generated files
git add .
git commit -m "Documentation updated"
git push origin gh-pages -fq > /dev/null
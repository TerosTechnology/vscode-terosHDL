# Testing plan

## Branches

- main (**protected**): principal branch. All the commit in main will be tagged in the CI. Also it will created a release in Githb and NPM market.
- develop (**protected**): development branch.
- dev_*: feature branch.


## Continuous integration

- Pull request:
  - Test lint
  - Unit tests for:
    - Ubuntu 18.04
    - Ubuntu 20.04
    - Ubuntu 22.04
    - macOS latest
    - Windows latest

- Push in main:
  - Test lint
  - Unit tests for:
    - Ubuntu 18.04
    - Ubuntu 20.04
    - Ubuntu 22.04
    - macOS latest
    - Windows latest
  - Publish test report webpage
  - Release NPM package
  - Release Github code

- Others: none

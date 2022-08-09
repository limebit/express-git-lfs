#!/bin/sh

set -ex

yarn run prisma:generate
yarn run prisma:db:deploy
yarn run start

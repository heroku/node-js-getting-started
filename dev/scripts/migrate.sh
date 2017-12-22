#!/bin/bash

echo "Sleeping 5"
sleep 5;
echo "Migrating"
echo ""
flyway migrate;
#!/usr/bin/env bash

TAG=$1
IMAGE=$2
SERVICE=$3
DSD_DRG="drg.dasudian.net"
LOCAL_DRG="registry.swarm:5000"

# echo "$IMAGE"
# exit 0

# Pull new image
docker image pull ${DSD_DRG}/${IMAGE}:${TAG}
# retag the image
# newId=$(date +'%m%d%H%M')
docker image tag ${DSD_DRG}/${IMAGE}:${TAG} ${LOCAL_DRG}/${IMAGE}:${TAG}
# push the newId image to local registry
docker image push ${LOCAL_DRG}/${IMAGE}:${TAG}

# Update the bbpfcs service
echo "Update the service [${SERVICE}]"
docker service update --image ${LOCAL_DRG}/${IMAGE}:${TAG} ${SERVICE}

# Cleanup images
docker image rm ${LOCAL_DRG}/${IMAGE}:${TAG}
docker image rm ${DSD_DRG}/${IMAGE}:${TAG}

echo "Update service [$SERVICE] done!"

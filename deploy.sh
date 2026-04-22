#!/bin/bash
# ══════════════════════════════════════════════════════════════════════
# deploy.sh — Actualiza SuperApi desde GHCR y reinicia el container
# Uso: bash deploy.sh [tag]
#   tag: versión a deployar (default: latest)
#   Ej: bash deploy.sh v1.2.0
# ══════════════════════════════════════════════════════════════════════
set -e

TAG=${1:-latest}
IMAGE="ghcr.io/lautaromartinez04/gde-superapi"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 SuperApi Deploy — $IMAGE:$TAG"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Login a GHCR (requiere GITHUB_TOKEN o PAT con read:packages)
#    Ejecutar una sola vez manualmente:
#    echo $GITHUB_TOKEN | docker login ghcr.io -u lautaromartinez04 --password-stdin
echo "📦 Pulling image $IMAGE:$TAG ..."
docker pull "$IMAGE:$TAG"

# 2. Actualizar el tag en docker-compose si se especificó uno concreto
if [ "$TAG" != "latest" ]; then
    sed -i "s|image: $IMAGE:.*|image: $IMAGE:$TAG|" docker-compose.yml
    echo "🏷️  docker-compose.yml actualizado → $IMAGE:$TAG"
fi

# 3. Recrear el container (sin downtime extra, el volumen se preserva)
echo "🔄 Reiniciando container ..."
docker compose up -d --no-build

# 4. Limpiar imágenes viejas (libera espacio en disco)
echo "🧹 Limpiando imágenes antiguas ..."
docker image prune -f

echo ""
echo "✅ Deploy completado!"
echo ""
docker compose ps

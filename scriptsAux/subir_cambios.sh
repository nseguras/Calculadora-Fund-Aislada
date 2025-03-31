#!/bin/bash

echo "🚀 Subiendo cambios a main..."
git checkout main
git add .
git commit -m "Actualización automática"
git push origin main

echo "🔄 Pasando cambios a releaseV2..."
git checkout releaseV2
git merge main
git push origin releaseV2

echo "✅ Proceso completado con éxito"

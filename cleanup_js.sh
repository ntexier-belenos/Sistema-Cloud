#!/bin/bash

# Ce script supprime les fichiers JavaScript qui ont un équivalent TypeScript
# Utilisation: ./cleanup_js.sh

# Fonction pour vérifier si un fichier TypeScript équivalent existe
has_tsx_equivalent() {
    local js_file="$1"
    local tsx_file="${js_file%.js}.tsx"
    
    if [ -f "$tsx_file" ]; then
        return 0  # true
    else
        return 1  # false
    fi
}

# Rechercher tous les fichiers .js
for js_file in $(find /workspace/frontend/src -name "*.js"); do
    if has_tsx_equivalent "$js_file"; then
        echo "Suppression de $js_file (remplacé par ${js_file%.js}.tsx)"
        rm -f "$js_file"
    else
        echo "Conservation de $js_file (pas d'équivalent TypeScript)"
    fi
done

echo "Nettoyage terminé!"

mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c rules     --file ./data/rules.json     --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c attacks   --file ./data/attacks.json   --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c abilities --file ./data/abilities.json --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c actions   --file ./data/actions.json   --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c models    --file ./data/models.json    --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c factions  --file ./data/factions.json  --jsonArray

mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c attacks   --file ./data/orks/attacks.json   --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c models    --file ./data/orks/models.json    --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c factions  --file ./data/orks/factions.json  --jsonArray
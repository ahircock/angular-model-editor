mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c rules     --file ./data/rules.json     --jsonArray --drop
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c abilities --file ./data/abilities.json --jsonArray --drop
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c actions   --file ./data/actions.json   --jsonArray --drop
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c attacks   --file ./data/attacks.json   --jsonArray --drop
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c models    --file ./data/models.json    --jsonArray --drop
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c factions  --file ./data/factions.json  --jsonArray --drop

mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c abilities --file ./data/40k-admil/abilities.json --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c actions   --file ./data/40k-admil/actions.json   --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c attacks   --file ./data/40k-admil/attacks.json   --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c models    --file ./data/40k-admil/models.json    --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c factions  --file ./data/40k-admil/factions.json  --jsonArray

mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c abilities --file ./data/40k-necrons/abilities.json --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c actions   --file ./data/40k-necrons/actions.json   --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c attacks   --file ./data/40k-necrons/attacks.json   --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c models    --file ./data/40k-necrons/models.json    --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c factions  --file ./data/40k-necrons/factions.json  --jsonArray

mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c abilities --file ./data/40k-orks/abilities.json --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c actions   --file ./data/40k-orks/actions.json   --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c attacks   --file ./data/40k-orks/attacks.json   --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c models    --file ./data/40k-orks/models.json    --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c factions  --file ./data/40k-orks/factions.json  --jsonArray


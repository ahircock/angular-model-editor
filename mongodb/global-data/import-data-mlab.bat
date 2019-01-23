mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c rules     --file rules.json   --jsonArray --drop
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c attacks   --file attacks.json --jsonArray --drop
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c abilities --file abilities.json --jsonArray --drop
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c actions   --file actions.json --jsonArray --drop
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c models    --file models.json  --jsonArray --drop
mongoimport -h ds237669.mlab.com:37669 -u <user> -p <pwd> -d model-editor -c factions  --file factions.json  --jsonArray --drop
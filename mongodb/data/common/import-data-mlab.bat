mongoimport -h ds237669.mlab.com:37669 -u %1 -p %2 -d model-editor -c abilities --file ./abilities.json --jsonArray --mode upsert
mongoimport -h ds237669.mlab.com:37669 -u %1 -p %2 -d model-editor -c actions   --file ./actions.json   --jsonArray --mode upsert
mongoimport -h ds237669.mlab.com:37669 -u %1 -p %2 -d model-editor -c attacks   --file ./attacks.json   --jsonArray --mode upsert
mongoimport -h ds237669.mlab.com:37669 -u %1 -p %2 -d model-editor -c factions  --file ./factions.json  --jsonArray --mode upsert
mongoimport -h ds237669.mlab.com:37669 -u %1 -p %2 -d model-editor -c models    --file ./models.json    --jsonArray --mode upsert
mongoimport -h ds237669.mlab.com:37669 -u %1 -p %2 -d model-editor -c rules     --file ./rules.json     --jsonArray --mode upsert

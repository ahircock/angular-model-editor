mongoimport -d model-editor -c abilities --file ./abilities.json --jsonArray --mode upsert
mongoimport -d model-editor -c actions   --file ./actions.json   --jsonArray --mode upsert
mongoimport -d model-editor -c attacks   --file ./attacks.json   --jsonArray --mode upsert
mongoimport -d model-editor -c factions  --file ./factions.json  --jsonArray --mode upsert
mongoimport -d model-editor -c models    --file ./models.json    --jsonArray --mode upsert
mongoimport -d model-editor -c rules     --file ./rules.json     --jsonArray --mode upsert

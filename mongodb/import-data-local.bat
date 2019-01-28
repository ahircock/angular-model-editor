mongoimport -d model-editor -c rules     --file ./data/rules.json     --jsonArray --drop
mongoimport -d model-editor -c attacks   --file ./data/attacks.json   --jsonArray --drop
mongoimport -d model-editor -c abilities --file ./data/abilities.json --jsonArray --drop
mongoimport -d model-editor -c actions   --file ./data/actions.json   --jsonArray --drop
mongoimport -d model-editor -c models    --file ./data/models.json    --jsonArray --drop
mongoimport -d model-editor -c factions  --file ./data/factions.json  --jsonArray --drop

mongoimport -d model-editor -c abilities --file ./data/orks/abilities.json --jsonArray
mongoimport -d model-editor -c attacks   --file ./data/orks/attacks.json   --jsonArray
mongoimport -d model-editor -c models    --file ./data/orks/models.json    --jsonArray
mongoimport -d model-editor -c factions  --file ./data/orks/factions.json  --jsonArray


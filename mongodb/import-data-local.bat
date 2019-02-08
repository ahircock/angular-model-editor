mongoimport -d model-editor -c abilities --file ./data/abilities.json --jsonArray --drop
mongoimport -d model-editor -c actions   --file ./data/actions.json   --jsonArray --drop
mongoimport -d model-editor -c attacks   --file ./data/attacks.json   --jsonArray --drop
mongoimport -d model-editor -c factions  --file ./data/factions.json  --jsonArray --drop
mongoimport -d model-editor -c models    --file ./data/models.json    --jsonArray --drop
mongoimport -d model-editor -c rules     --file ./data/rules.json     --jsonArray --drop

mongoimport -d model-editor -c abilities --file ./data/40k-admech/abilities.json --jsonArray
mongoimport -d model-editor -c actions   --file ./data/40k-admech/actions.json   --jsonArray
mongoimport -d model-editor -c attacks   --file ./data/40k-admech/attacks.json   --jsonArray
mongoimport -d model-editor -c factions  --file ./data/40k-admech/factions.json  --jsonArray
mongoimport -d model-editor -c models    --file ./data/40k-admech/models.json    --jsonArray
mongoimport -d model-editor -c factions  --file ./data/40k-admech/rules.json     --jsonArray

mongoimport -d model-editor -c abilities --file ./data/40k-admil/abilities.json --jsonArray
mongoimport -d model-editor -c actions   --file ./data/40k-admil/actions.json   --jsonArray
mongoimport -d model-editor -c attacks   --file ./data/40k-admil/attacks.json   --jsonArray
mongoimport -d model-editor -c factions  --file ./data/40k-admil/factions.json  --jsonArray
mongoimport -d model-editor -c models    --file ./data/40k-admil/models.json    --jsonArray
mongoimport -d model-editor -c factions  --file ./data/40k-admil/rules.json     --jsonArray

mongoimport -d model-editor -c abilities --file ./data/40k-astartes/abilities.json --jsonArray
mongoimport -d model-editor -c actions   --file ./data/40k-astartes/actions.json   --jsonArray
mongoimport -d model-editor -c attacks   --file ./data/40k-astartes/attacks.json   --jsonArray
mongoimport -d model-editor -c factions  --file ./data/40k-astartes/factions.json  --jsonArray
mongoimport -d model-editor -c models    --file ./data/40k-astartes/models.json    --jsonArray
mongoimport -d model-editor -c factions  --file ./data/40k-astartes/rules.json     --jsonArray

mongoimport -d model-editor -c abilities --file ./data/40k-gcult/abilities.json --jsonArray
mongoimport -d model-editor -c actions   --file ./data/40k-gcult/actions.json   --jsonArray
mongoimport -d model-editor -c attacks   --file ./data/40k-gcult/attacks.json   --jsonArray
mongoimport -d model-editor -c factions  --file ./data/40k-gcult/factions.json  --jsonArray
mongoimport -d model-editor -c models    --file ./data/40k-gcult/models.json    --jsonArray
mongoimport -d model-editor -c factions  --file ./data/40k-gcult/rules.json     --jsonArray

mongoimport -d model-editor -c abilities --file ./data/40k-necrons/abilities.json --jsonArray
mongoimport -d model-editor -c actions   --file ./data/40k-necrons/actions.json   --jsonArray
mongoimport -d model-editor -c attacks   --file ./data/40k-necrons/attacks.json   --jsonArray
mongoimport -d model-editor -c factions  --file ./data/40k-necrons/factions.json  --jsonArray
mongoimport -d model-editor -c models    --file ./data/40k-necrons/models.json    --jsonArray
mongoimport -d model-editor -c factions  --file ./data/40k-necrons/rules.json     --jsonArray

mongoimport -d model-editor -c abilities --file ./data/40k-orks/abilities.json --jsonArray
mongoimport -d model-editor -c actions   --file ./data/40k-orks/actions.json   --jsonArray
mongoimport -d model-editor -c attacks   --file ./data/40k-orks/attacks.json   --jsonArray
mongoimport -d model-editor -c factions  --file ./data/40k-orks/factions.json  --jsonArray
mongoimport -d model-editor -c models    --file ./data/40k-orks/models.json    --jsonArray
mongoimport -d model-editor -c factions  --file ./data/40k-orks/rules.json     --jsonArray

mongoimport -d model-editor -c abilities --file ./data/40k-tyranids/abilities.json --jsonArray
mongoimport -d model-editor -c actions   --file ./data/40k-tyranids/actions.json   --jsonArray
mongoimport -d model-editor -c attacks   --file ./data/40k-tyranids/attacks.json   --jsonArray
mongoimport -d model-editor -c factions  --file ./data/40k-tyranids/factions.json  --jsonArray
mongoimport -d model-editor -c models    --file ./data/40k-tyranids/models.json    --jsonArray
mongoimport -d model-editor -c factions  --file ./data/40k-tyranids/rules.json     --jsonArray

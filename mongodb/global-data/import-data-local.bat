mongoimport -d model-editor -c rules   --file rules.json   --jsonArray --drop
mongoimport -d model-editor -c attacks --file attacks.json --jsonArray --drop
mongoimport -d model-editor -c models  --file models.json  --jsonArray --drop

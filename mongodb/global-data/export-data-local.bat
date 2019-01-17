mongoexport -d model-editor -c rules   --out rules.json   --jsonArray
mongoexport -d model-editor -c actions --out actions.json --jsonArray
mongoexport -d model-editor -c models  --out models.json  --jsonArray

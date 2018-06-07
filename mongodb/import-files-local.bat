mongoimport --db model-editor --collection models --file mongo.models.json --jsonArray --drop
mongoimport --db model-editor --collection forces --file mongo.forces.json --jsonArray --drop
mongoimport --db model-editor --collection rules  --file mongo.rules.json  --jsonArray --drop
mongoimport --db model-editor --collection config --file mongo.config.json  --jsonArray --drop
mongoimport -h ds237669.mlab.com:37669 -u admin -p blix2400 --db model-editor --collection models --file mongo.models.json --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u admin -p blix2400 --db model-editor --collection forces --file mongo.forces.json --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u admin -p blix2400 --db model-editor --collection rules  --file mongo.rules.json  --jsonArray
mongoimport -h ds237669.mlab.com:37669 -u admin -p blix2400 --db model-editor --collection config --file mongo.config.json  --jsonArray
/**
 * Created by bcuser on 11/22/16.
 */

var servers = ['http://192.168.2.19:5984', 'http://35.165.124.2:5984'];
var dbName = 'game_data_jun';

var nanoDb = require('nano')(servers[1]);

function createDatabase(callback) {
    'use strict';
    console.log('CreateDatabase called');
    nanoDb.db.create(dbName, callback);
}

function deleteDatabase(callback) {
    'use strict';
    console.log('DeleteDatabase called');
    nanoDb.db.destroy(dbName, callback);
}

function readDatabase(callback) {
    'use strict';
    console.log('ReadDatabase called');

    var database = nanoDb.db.use(dbName);

    database.list({
        include_docs: true
    }, callback);

}

function insertBulk(callback) {
    'use strict';
    console.log('InsertBulk called');

    var npcData = require('../npcs.json');

    var expectedInserts = Object.keys(npcData).length;

    for (var x in npcData) {
        var currentNpc = npcData[x];
        insert(currentNpc, function() {
            expectedInserts--;

            if (expectedInserts === 0) {
                callback({
                    result: 'ok'
                });
            }

        });
    }

}

function deleteNpc(npcId, callback) {
    'use strict';
    var database = nanoDb.db.use(dbName);

    database.list({
        include_docs: true
    }, function(err, result) {

        for (var x in result.rows) {

            var currentNpc = result.rows[x].doc;

            if (currentNpc.npc_id == npcId) {

                database.destroy(currentNpc._id, currentNpc._rev, callback);

            }

        }

    });

}

function insert(data, callback) {
    'use strict';
    var database = nanoDb.db.use(dbName);
    database.insert(data, callback);
}

module.exports = {
    createDatabase: createDatabase,
    deleteDatabase: deleteDatabase,
    deleteNpc: deleteNpc,
    readDatabase: readDatabase,
    insertBulk: insertBulk
};

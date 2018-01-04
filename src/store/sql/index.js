export default {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    createUserDB (payload) {
      return new Promise((resolve, reject) => {
        let db = null
        // if it's production
        if (payload.isProd) {
          window.sqlitePlugin.echoTest(() => {
            alert('sqlitePlugin echo OK.')
          })
          db = window.sqlitePlugin.openDatabase({name: 'userData.db', location: 'default'})
        }
        // else if its dev
        else {
          db = window.openDatabase('userData', '0.1', 'user data db', 2 * 1024 * 1024)
        }
        if (db) {
          resolve(db)
        }
        else {
          reject(new Error('Error creating DataBase'))
        }
      })
    },
    saveActivity ({ commit }, payload) {
      // if it's production
      if (payload.isProd) {
        window.sqlitePlugin.echoTest(() => {
          alert('sqlitePlugin echo OK.')
        })
        const db = window.sqlitePlugin.openDatabase({name: 'userData.db', location: 'default'})
        db.sqlBatch([
          'CREATE TABLE IF NOT EXISTS activitiesTable (date, category, start, end, duration)',
          [
            'INSERT INTO activitiesTable VALUES (?,?,?,?,?)',
            [payload.act.date, payload.act.category, payload.act.start, payload.act.end, payload.act.duration]
          ]
        ], function () {
          alert('Populated database OK')
        }, function (error) {
          alert('SQL batch ERROR: ' + error.message)
        })
      }
      // else if its dev
      else {
        const db = window.openDatabase('userData', '0.1', 'user data db', 2 * 1024 * 1024)
        db.transaction((tx) => {
          tx.executeSql('CREATE TABLE IF NOT EXISTS activitiesTable (date, category, start, end, duration)')
          tx.executeSql(
            'INSERT INTO activitiesTable VALUES (?,?,?,?,?)',
            [payload.act.date, payload.act.category, payload.act.start, payload.act.end, payload.act.duration]
          )
        }, function (error) {
          console.log('Transaction ERROR: ' + error.message)
        }, function () {
          console.log('Populated database OK')
        })
      }
    }
  }
}

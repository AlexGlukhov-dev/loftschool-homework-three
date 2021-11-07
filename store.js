const db = require('./db')()

const getData = () => {
    const age = db.stores.file.store.skills[0]['number']
    const concerts = db.stores.file.store.skills[1]['number']
    const cities = db.stores.file.store.skills[2]['number']
    const years = db.stores.file.store.skills[3]['number']
  
    return {
      'skills': {
        'age': age,
        'concerts': concerts,
        'cities': cities,
        'years': years,
      }  
    }
}


module.exports = getData

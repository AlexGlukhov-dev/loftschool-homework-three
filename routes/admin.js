const express = require('express')
const store = require('../store')

const formidable = require('formidable')
const router = express.Router()
const db = require('../db')()
const path = require('path')

const fs = require('fs')
const util = require("util");

const mkDir = util.promisify(fs.mkdir);
const unlink = util.promisify(fs.unlink)

router.get('/', (req, res, next) => {
  res.render('pages/admin', { 
    title: 'Admin page', 
    age: store().skills.age, 
    concerts: store().skills.concerts, 
    cities: store().skills.cities, 
    years: store().skills.years
  })
})

router.post('/skills', (req, res, next) => {
  let form = new formidable.IncomingForm({ multiples: true })
  
  form.parse(req, (err, fields, files) => {
    const age = parseInt(fields.age);
    const concerts = parseInt(fields.concerts);
    const cities = parseInt(fields.cities);
    const years = parseInt(fields.years);

    const skills = [
      {
        "number": age,
        "text": "Возраст начала занятий на скрипке"
      },
      {
        "number": concerts,
        "text": "Концертов отыграл"
      },
      {
        "number": cities,
        "text": "Максимальное число городов в туре"
      },
      {
        "number": years,
        "text": "Лет на сцене в качестве скрипача"
      }
    ]

    db.set('skills', skills)
    db.save()

    res.render('pages/admin', { 
      title: 'Admin page', 
      age: age, 
      concerts: concerts, 
      cities: cities, 
      years: years,
      msgskill: "Данные сохранены!"
    })

  });
})

router.post('/upload', async (req, res, next) => {  
  let form = new formidable.IncomingForm()
  let upload = path.join('./public', 'assets', 'img', 'products')
  
  fs.access(upload, async (err) => {
    await mkDir(upload)
  });
  
  form.uploadDir = path.join(process.cwd(), upload)

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return next(err)
    }

    const valid = validation(fields, files)

    if (valid.err) {
      await unlink(files.photo.path)
      return res.redirect(`/?msg=${valid.status}`)
    }
    
    const fileName = path.join(upload, files.photo.name)
    const products = db.stores.file.store.products

    fs.rename(files.photo.path, fileName, function (err) {
      if (err) {
        console.error(err.message)
        return
      }

      const newProduct = {
        "src": fileName.replace('public/', './'),
        "name": fields.name,
        "price": parseInt(fields.price)
      }

      products.push(newProduct);

      db.set('products', products)
      db.save()

      res.render('pages/admin', { 
        title: 'Admin page', 
        "name": fields.name,
        "price": parseInt(fields.price),
        msgfile: "Товар загружен!"
      })

    })
  })
})

const validation = (fields, files) => {
  if (files.photo.name === '' || files.photo.size === 0) {
    return { status: 'Не загружена картинка!', err: true }
  }
  if (!fields.name) {
    return { status: 'Не указано описание картинки!', err: true }
  }
  return { status: 'Ok', err: false }
}

module.exports = router

const express = require('express')

const router = express.Router()
const nodemailer = require('nodemailer')

const { products, skills } = require('../data.json')
const config = require('../config.json')

router.get('/', (req, res, next) => {
  res.render('pages/index', { title: 'Main page', products, skills })
})

router.post('/', (req, res, next) => {
  
  if (!req.body.name || !req.body.email || !req.body.message) {  
    res.render('pages/index', { 
      title: 'Main page', 
      products, 
      skills,
      msgemail: 'Все поля нужно заполнить!'
     })
  }
  
  const transporter = nodemailer.createTransport(config.mail.smtp)
  
  const mailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text:
      req.body.message.trim().slice(0, 500) +
      `\n Отправлено с: <${req.body.email}>`
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.render('pages/index', { 
        title: 'Main page', 
        products, 
        skills,
        msgemail: `При отправке письма произошла ошибка!: ${error}`
       })
    }

    res.render('pages/index', { 
      title: 'Main page', 
      products, 
      skills,
      msgemail: 'Письмо успешно отправлено!'
     })
  })

})

module.exports = router

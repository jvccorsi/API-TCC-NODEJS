const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path')



var transport = nodemailer.createTransport({
  service: 'gmail',
  auth:{
    user: 'tcccorsi2022@gmail.com',
    pass:'tzeigpwwaoquyzqw'
  },

});

transport.use('compile', hbs({
  viewEngine: {
    defaultLayout: undefined,
    partialsDir: path.resolve('./resources/email/')
  },
  viewPath: path.resolve('./resources/email/'),
  extName: '.html',
}));

module.exports = transport;
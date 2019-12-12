const fs = require('fs');
const path = require('path');
const Excel = require('exceljs');
const nodemailer = require('nodemailer');

try {
  const toString = (regexp) => {
    const [node, executable, ...params] = process.argv;

    let result = params.map(i => regexp.exec(i)).find(i => i);
    return result === undefined ? undefined : String(result[1])
  };

  const toNumber = (regexp) => {
    const [node, executable, ...params] = process.argv;
    let str = params.map(i => regexp.exec(i)).find(i => i);
    if (str === undefined) return undefined;
    let unit = str[1].slice(-1);
    let size = str[1].slice(0, str[1].indexOf(unit));
    let result;
    if (unit === 'B') {
      result = +size;
    } else if (unit === 'K') {
      result = size / 0.001;
    } else if (unit === 'M') {
      result = size / 1e-6;
    } else if (unit === 'G') {
      result = size / 1e-9;
    } else {
      result = undefined
    }
    return result;
  };

  const TYPE = /--TYPE=(.*)/i;
  const PATTERN = /--PATTERN=(.*)/i;
  const MIN_SIZE = /--MIN-SIZE=(.*)/i;
  const MAX_SIZE = /--MAX-SIZE=(.*)/i;
  const EMAIL = /--EMAIL-TO=(.*)/i;
  const DIR = /--DIR=(.*)/i;

  const options = {
    TYPE: toString(TYPE),
    PATTERN: toString(PATTERN),
    MAX_SIZE: toNumber(MAX_SIZE),
    MIN_SIZE: toNumber(MIN_SIZE),
    DIR: toString(DIR),
    EMAIL: toString(EMAIL)
  };

  console.log(options);
  if (!options.DIR) throw new Error('invalid DIR');
  if (!options.EMAIL) throw new Error('invalid EMAIL');


//find all files


  const walk = (dir, optionFilter, done) => {
    let results = [];
    fs.readdir(dir, optionFilter, (err, list) => {
      if (err) return done(err);
      let pending = list.length;
      if (!pending) return done(null, results);
      list.forEach((file) => {
        file = path.resolve(dir, file);
        fs.stat(file, (err, stat) => {
          let checkPattern = new RegExp(optionFilter.PATTERN).test(path.basename(file));
          let conditionFile =
              (checkPattern || optionFilter.PATTERN === undefined) //совпадает паттерн или не определён
              && (optionFilter.TYPE === 'F' || optionFilter.TYPE === undefined)  //тип "F" или не определён
              && ((stat.size >= optionFilter.MIN_SIZE && stat.size <= optionFilter.MAX_SIZE)//размер файла в заданном диапазоне
              || optionFilter.MIN_SIZE === undefined || optionFilter.MAX_SIZE === undefined); //размер файла не определён
          let conditionDirectory =
              (checkPattern || optionFilter.PATTERN === undefined) //паттерн совпадает или не определён
              && (optionFilter.TYPE === 'D' || optionFilter.TYPE === undefined); //тип "D" или не определён

          if (stat && stat.isDirectory()) {
            if (conditionDirectory) results.push(file);
            walk(file, optionFilter, (err, res) => {
              results = results.concat(res);
              if (!--pending) done(null, results);
            });
          } else {
            if (conditionFile) results.push(file);
            if (!--pending) done(null, results);
          }
        });
      });
    });
  };

  walk(options.DIR, options, (err, results) => {
    //create excel and add result in excel
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Path');
    worksheet.columns = [{header: 'Path to file:', key: 'filename', width: 100}];
    results.forEach(filename => worksheet.addRow({filename}));
    workbook.xlsx.writeFile('./' + 'result.xlsx');
    console.log('Excel file saved.');

    //----------------------------------//
    //     send excel file on gmail    //
    const smtpProperties = JSON.parse(fs.readFileSync('./smtp.properties'));

    const transporter = nodemailer.createTransport({ //await
      host: smtpProperties.host,
      port: smtpProperties.port,
      auth: {
        user: smtpProperties.auth.user,
        pass: smtpProperties.auth.pass
      }
    });

    let mailOptions = {
      from: `${smtpProperties.user}`,
      to: options.EMAIL,
      subject: 'HW_07(NodeJS)',
      text: 'Homework is completed!',
      attachments: [
        {
          path: './result.xlsx'
        }
      ],
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent.\nPlease check your email')
      }
    });
  });

} catch (e) {
  console.log('ERROR:', e.message)
}

const boom = require('boom')
const Pdfmake = require('pdfmake')
const generator = require('../pdf')
const { getState } = require('../db')
const fonts = {
  Roboto: {
    normal: 'server/pdf/fonts/Roboto-Regular.ttf',
    bold: 'server/pdf/fonts/Roboto-Medium.ttf',
    italics: 'server/pdf/fonts/Roboto-Italic.ttf',
    bolditalics: 'server/pdf/fonts/Roboto-MediumItalic.ttf'
  }
}

const printer = new Pdfmake(fonts)

function generate (definition) {
  return new Promise(resolve => {
    const pdf = printer.createPdfKitDocument(definition)
    const raw = []

    pdf.on('data', function (chunk) {
      raw.push(chunk)
    })

    pdf.on('end', function () {
      resolve(Buffer.concat(raw))
    })

    pdf.end()
  })
}

module.exports = {
  method: 'GET',
  path: '/pdf',
  options: {
    handler: async (request, h) => {
      const model = request.server.plugins['digital-form-builder-engine'].model
      const data = await getState(request)

      try {
        const def = generator(model, data)

        const pdf = await generate(def)

        const response = h.response(pdf)
          .type('application/pdf')

        if ('download' in request.query) {
          const disposition = 'attachment; filename=' + 'certificate.pdf'
          response.header('Content-Disposition', disposition)
        }

        return response
      } catch (err) {
        return boom.badImplementation('Failed to create PDF', err)
      }
    }
  }
}

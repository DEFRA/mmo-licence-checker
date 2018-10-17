const path = require('path')
const moment = require('moment')
const headerImage = path.resolve(__dirname, './header.jpg')

function getPdfDef (model, state) {
  const content = [{
    image: headerImage,
    width: 200
  }, {
    style: 'header',
    text: 'Marine Management Organisation Marine Licence requirement check'
  }, {
    style: 'subHeader',
    text: 'Introduction'
  }, {
    text: 'The purpose of the MMO marine licence requirement checker tool is to assist prospective applicants to determine whether a marine licence is be required in order to carry out an activity. The outcome produced is based on the answers provided. Prospective applicants are responsible for ensuring that the information provided is true and accurate. Providing false or inaccurate information may result in enforcement action being taken.'
  }, {
    style: 'subHeader',
    text: 'Date of Check'
  }, {
    text: moment().format('d MMM YYYY')
  }]

  let page = model.pages[0]
  let value = null
  const journey = []

  function getValue (page) {
    const component = page.components.formItems[0]

    if (!component) {
      return
    }

    const data = page.section ? (state[page.section.name] || {}) : state
    return [component.title, component.getDisplayStringFromState(data)]
  }

  // Work out the journey steps
  while (page && (value = getValue(page)) && value[1]) {
    journey.push(value)

    const next = page.hasNext && page.getNext(state)
    page = model.pages.find(p => p.path === next)
  }

  // The last page should be a terminal page.
  // If it is, use it a the summary content on the pdf.
  if (page && !page.hasNext) {
    const component = page.components.items[0]
    if (component) {
      content.push({
        style: 'subHeader',
        text: 'Summary'
      })

      // Replace the HTML (todo: a better way is needed)
      content.push(component.getViewModel().content.replace(/<(?:.|\n)*?>/gm, ''))
    }
  }

  content.push({
    style: 'subHeader',
    text: 'Answers'
  })

  journey.forEach(step => {
    content.push({
      text: step[0]
    })
    content.push({
      style: 'para',
      text: { text: step[1], bold: true }
    })
  })

  const def = {
    watermark: { text: 'Test Document', color: 'blue', opacity: 0.3, bold: true, italics: false },
    info: {
      title: 'Marine Management Organisation - DEFRA',
      author: 'Marine Management Organisation (DEFRA)',
      subject: 'Marine Licence requirement check'
    },
    content: content,
    styles: {
      header: {
        fontSize: 22,
        margin: [0, 20, 0, 20],
        bold: true,
        alignment: 'justify'
      },
      subHeader: {
        fontSize: 18,
        margin: [0, 16, 0, 16],
        bold: true,
        alignment: 'justify'
      },
      para: {
        margin: [0, 0, 0, 16]
      },
      strong: {
        bold: true
      }
    },
    footer: {
      columns: [
        { image: path.resolve(__dirname, './footer.png'), fit: [350, 110], alignment: 'center' }
      ]
    }
  }

  return def
}

module.exports = getPdfDef

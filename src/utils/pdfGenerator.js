import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function generatePDFReport({ elementId, filename = 'Madame_Minute_Report.pdf' }) {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`Element #${elementId} not found for PDF export`)
    return false
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#141414',
      logging: false,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId)
        if (clonedElement) {
          // Replace modern oklab/oklch colors in computed styles with standard RGB/Hex values
          const allElements = clonedElement.querySelectorAll('*')
          const sanitizeElement = (el) => {
            const computedStyle = window.getComputedStyle(el)
            const props = ['color', 'backgroundColor', 'borderColor', 'outlineColor']
            props.forEach(prop => {
              const val = computedStyle[prop]
              if (val && (val.includes('oklab') || val.includes('oklch'))) {
                // Fallback safe values based on element class/tag
                if (prop === 'backgroundColor') {
                  el.style.backgroundColor = el.classList.contains('bg-[#1E1E1E]') ? '#1E1E1E' : '#141414'
                } else if (prop === 'color') {
                  el.style.color = el.classList.contains('text-amber-500') || el.classList.contains('text-amber-400') ? '#F59E0B' : '#E4E4E7'
                } else if (prop === 'borderColor') {
                  el.style.borderColor = '#2E2E2E'
                }
              }
            })
          }
          sanitizeElement(clonedElement)
          allElements.forEach(sanitizeElement)
        }
      }
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210
    const pageHeight = 297
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(filename)
    return true
  } catch (err) {
    console.error('Failed to generate PDF report:', err)
    return false
  }
}

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { Board, ChartCard, DataSource, findDimension, findMetric } from '../store/dashboard'
import { makeKpiValue, makePieData, makeSeriesData, makeTableData } from '../data/chartMock'

// =============== PNG ===============
export async function exportElementAsPng(element: HTMLElement, filename: string) {
  const canvas = await html2canvas(element, {
    backgroundColor: '#f5f7fa',
    scale: 2,
    useCORS: true,
    logging: false,
    // 使用宽度限制，避免长图过大
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  })
  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = ensureExt(filename, 'png')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// =============== PDF ===============
export async function exportElementAsPdf(element: HTMLElement, filename: string, title: string) {
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  })

  const imgData = canvas.toDataURL('image/png')
  // A4 横向：宽 297mm，高 210mm；用 mm 单位
  const pdf = new jsPDF('l', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 10
  const headerH = 12

  // 页头
  drawPdfHeader(pdf, title, pageWidth, headerH)

  const usableW = pageWidth - margin * 2
  const usableH = pageHeight - margin * 2 - headerH

  const ratio = canvas.width / canvas.height
  let drawW = usableW
  let drawH = drawW / ratio
  if (drawH > usableH) {
    // 整图分页
    const pageCanvasH = (canvas.width * usableH) / usableW
    let posY = 0
    let pageIdx = 0
    while (posY < canvas.height) {
      if (pageIdx > 0) {
        pdf.addPage()
        drawPdfHeader(pdf, title, pageWidth, headerH)
      }
      const sliceH = Math.min(pageCanvasH, canvas.height - posY)
      const tmp = document.createElement('canvas')
      tmp.width = canvas.width
      tmp.height = sliceH
      const ctx = tmp.getContext('2d')!
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, tmp.width, tmp.height)
      ctx.drawImage(canvas, 0, posY, canvas.width, sliceH, 0, 0, canvas.width, sliceH)
      const sliceData = tmp.toDataURL('image/png')
      const sliceDrawH = (sliceH * usableW) / canvas.width
      pdf.addImage(sliceData, 'PNG', margin, margin + headerH, usableW, sliceDrawH)
      posY += sliceH
      pageIdx += 1
    }
  } else {
    pdf.addImage(imgData, 'PNG', margin, margin + headerH, drawW, drawH)
  }

  pdf.save(ensureExt(filename, 'pdf'))
}

function drawPdfHeader(pdf: jsPDF, title: string, pageWidth: number, headerH: number) {
  pdf.setFillColor(79, 124, 255)
  pdf.rect(0, 0, pageWidth, headerH, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(12)
  pdf.text(title, 8, 8)
  const dt = new Date().toISOString().slice(0, 19).replace('T', ' ')
  pdf.setFontSize(9)
  pdf.text(`导出时间：${dt}`, pageWidth - 8, 8, { align: 'right' })
}

// =============== Excel ===============
/**
 * 将看板下的所有图表，每个图表生成一个 sheet。
 * - 指标卡 / 仪表盘 → 单行表格
 * - 饼 / 漏斗 → 维度+指标两列
 * - 表格 → 直接使用 makeTableData
 * - 折线 / 柱 / 面积 / 散点 → 维度作行 + 多指标作列
 */
export function exportBoardAsExcel(board: Board, dataSources: DataSource[], filename: string) {
  const wb = XLSX.utils.book_new()

  if (board.charts.length === 0) {
    const ws = XLSX.utils.aoa_to_sheet([['当前看板暂无图表']])
    XLSX.utils.book_append_sheet(wb, ws, '空看板')
  }

  board.charts.forEach((chart, idx) => {
    const aoa = chartToAoa(chart, dataSources)
    const ws = XLSX.utils.aoa_to_sheet(aoa)
    // 列宽自适应
    if (aoa[0]) {
      ws['!cols'] = aoa[0].map((_, ci) => {
        const max = Math.max(
          ...aoa.map((row) =>
            String(row[ci] ?? '').length + (typeof row[ci] === 'number' ? 4 : 2),
          ),
        )
        return { wch: Math.min(40, Math.max(10, max + 2)) }
      })
    }
    const sheetName = sanitizeSheetName(`${idx + 1}-${chart.name}`)
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
  })

  XLSX.writeFile(wb, ensureExt(filename, 'xlsx'))
}

function chartToAoa(chart: ChartCard, dataSources: DataSource[]): any[][] {
  const dsName = dataSources.find((d) => d.id === chart.dataSourceId)?.name || '—'
  const head = [
    [`图表名称：${chart.name}`, `类型：${chartLabel(chart.type)}`, `数据源：${dsName}`],
    [],
  ]

  const metricNames = chart.metrics.map((id) => withUnit(findMetric(id)?.name || id, findMetric(id)?.unit))
  const dimNames = chart.dimensions.map((id) => findDimension(id)?.name || id)

  if (chart.metrics.length === 0) {
    return [...head, ['（未配置指标）']]
  }

  if (chart.type === 'kpi' || chart.type === 'gauge') {
    const m = chart.metrics[0]
    const v = makeKpiValue(m)
    return [
      ...head,
      ['指标', '当前值', '单位', '同比'],
      [
        findMetric(m)?.name || m,
        v.value,
        v.unit,
        `${v.delta >= 0 ? '+' : ''}${v.delta}%`,
      ],
    ]
  }

  if (chart.type === 'pie' || chart.type === 'funnel') {
    const dimId = chart.dimensions[0] || 'd-shop'
    const m = chart.metrics[0]
    const data = makePieData(m, dimId)
    const total = data.reduce((s, d) => s + d.value, 0) || 1
    return [
      ...head,
      [findDimension(dimId)?.name || dimId, withUnit(findMetric(m)?.name || m, findMetric(m)?.unit), '占比 (%)'],
      ...data.map((d) => [d.name, d.value, Math.round((d.value / total) * 1000) / 10]),
    ]
  }

  if (chart.type === 'table') {
    const rows = makeTableData(chart.metrics, chart.dimensions, 30)
    return [
      ...head,
      [...dimNames, ...metricNames],
      ...rows.map((r) => [
        ...chart.dimensions.map((d) => r[d]),
        ...chart.metrics.map((m) => r[m]),
      ]),
    ]
  }

  // line / bar / area / scatter -> X 轴 + 多指标
  const { x, series } = makeSeriesData(
    chart.metrics,
    chart.dimensions.length ? chart.dimensions : ['d-date'],
  )
  const dimId = chart.dimensions[0] || 'd-date'
  const dimLabel = findDimension(dimId)?.name || dimId
  return [
    ...head,
    [dimLabel, ...metricNames],
    ...x.map((label, i) => [label, ...series.map((s) => s.data[i])]),
  ]
}

function withUnit(name: string, unit?: string) {
  return unit ? `${name}（${unit}）` : name
}
function chartLabel(t: string) {
  const map: Record<string, string> = {
    line: '曲线图',
    bar: '柱状图',
    pie: '饼图',
    area: '面积图',
    kpi: '指标卡',
    table: '明细表',
    funnel: '漏斗图',
    scatter: '散点图',
    gauge: '仪表盘',
  }
  return map[t] || t
}
function sanitizeSheetName(name: string) {
  // Excel sheet 名称不能包含 \ / ? * [ ] : 且最长 31 字符
  return name.replace(/[\\/?*[\]:]/g, '_').slice(0, 31)
}
function ensureExt(name: string, ext: string) {
  if (name.toLowerCase().endsWith('.' + ext)) return name
  return `${name}.${ext}`
}

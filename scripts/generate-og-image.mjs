import { deflateSync } from "node:zlib"
import { writeFileSync } from "node:fs"

const WIDTH = 1200
const HEIGHT = 630
const OUT = new URL("../og.png", import.meta.url)

const pixels = Buffer.alloc(WIDTH * HEIGHT * 4)

function main() {
  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const idx = (y * WIDTH + x) * 4
      const g1 = 1 - Math.min(1, distance(x, y, 190, 80) / 760)
      const g2 = 1 - Math.min(1, distance(x, y, 1020, 130) / 680)
      const g3 = y / HEIGHT
      pixels[idx] = clamp(8 + 38 * g1 + 18 * g2 + 8 * g3)
      pixels[idx + 1] = clamp(13 + 34 * g1 + 22 * g2 + 8 * g3)
      pixels[idx + 2] = clamp(20 + 22 * g1 + 50 * g2 + 10 * g3)
      pixels[idx + 3] = 255
    }
  }

  drawCircle(156, 130, 54, [222, 190, 92, 255])
  drawCircle(172, 112, 18, [122, 171, 98, 255])
  drawCircle(194, 92, 10, [91, 145, 218, 255])
  drawCircle(210, 76, 7, [231, 87, 87, 255])
  drawArc(156, 130, 72, -38, 230, [238, 211, 134, 255], 8)
  drawArc(156, 130, 89, -18, 182, [97, 139, 217, 210], 5)

  drawLine(120, 486, 1080, 486, [224, 200, 150, 105], 2)
  drawLine(120, 488, 760, 488, [224, 200, 150, 190], 3)
  drawRect(120, 510, 272, 4, [224, 200, 150, 210])

  drawText("DSTS", 274, 104, 12, [246, 231, 194, 255])
  drawText("DUONG SAO TOA SANG", 120, 246, 9, [248, 238, 214, 255])
  drawText("KNOWLEDGE  MOVEMENT  STAR JOURNEY", 125, 366, 4, [189, 202, 218, 255])
  drawText("NO BLACK PAGES  PUBLIC TRUST  VIETNAMESE GLOBAL JOURNEY", 125, 420, 3, [141, 154, 174, 255])

  for (const point of [
    [905, 118, 3],
    [948, 164, 2],
    [1008, 112, 4],
    [1054, 206, 2],
    [988, 282, 3],
    [1092, 342, 2],
    [870, 318, 2]
  ]) {
    drawStar(point[0], point[1], point[2], [238, 211, 134, 210])
  }

  writeFileSync(OUT, encodePng(WIDTH, HEIGHT, pixels))
  console.log(`OG_IMAGE_GENERATED ${OUT.pathname} ${WIDTH}x${HEIGHT}`)
}

function encodePng(width, height, rgba) {
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
  }

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", concatUint32(width, height, Buffer.from([8, 6, 0, 0, 0]))),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ])
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii")
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const crcBuffer = Buffer.alloc(4)
  crcBuffer.writeUInt32BE(crc(Buffer.concat([typeBuffer, data])))
  return Buffer.concat([length, typeBuffer, data, crcBuffer])
}

function concatUint32(width, height, rest) {
  const buffer = Buffer.alloc(8)
  buffer.writeUInt32BE(width, 0)
  buffer.writeUInt32BE(height, 4)
  return Buffer.concat([buffer, rest])
}

function crc(buffer) {
  let c = 0xffffffff
  for (let i = 0; i < buffer.length; i += 1) {
    c ^= buffer[i]
    for (let k = 0; k < 8; k += 1) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
    }
  }
  return (c ^ 0xffffffff) >>> 0
}

function drawText(text, x, y, scale, color) {
  let cursor = x
  for (const char of text.toUpperCase()) {
    if (char === " ") {
      cursor += 4 * scale
      continue
    }
    const glyph = FONT[char] || FONT["?"]
    for (let row = 0; row < glyph.length; row += 1) {
      for (let col = 0; col < glyph[row].length; col += 1) {
        if (glyph[row][col] === "1") {
          drawRect(cursor + col * scale, y + row * scale, scale, scale, color)
        }
      }
    }
    cursor += 6 * scale
  }
}

function drawRect(x, y, w, h, color) {
  const x0 = Math.max(0, Math.floor(x))
  const y0 = Math.max(0, Math.floor(y))
  const x1 = Math.min(WIDTH, Math.ceil(x + w))
  const y1 = Math.min(HEIGHT, Math.ceil(y + h))
  for (let py = y0; py < y1; py += 1) {
    for (let px = x0; px < x1; px += 1) {
      setPixel(px, py, color)
    }
  }
}

function drawCircle(cx, cy, radius, color) {
  const r2 = radius * radius
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y += 1) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x += 1) {
      if ((x - cx) ** 2 + (y - cy) ** 2 <= r2) setPixel(x, y, color)
    }
  }
}

function drawArc(cx, cy, radius, startDeg, endDeg, color, thickness) {
  for (let deg = startDeg; deg <= endDeg; deg += 0.18) {
    const rad = deg * Math.PI / 180
    const x = cx + Math.cos(rad) * radius
    const y = cy + Math.sin(rad) * radius
    drawCircle(x, y, thickness, color)
  }
}

function drawLine(x0, y0, x1, y1, color, thickness) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps
    drawCircle(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, thickness, color)
  }
}

function drawStar(cx, cy, radius, color) {
  drawLine(cx - radius * 4, cy, cx + radius * 4, cy, color, radius)
  drawLine(cx, cy - radius * 4, cx, cy + radius * 4, color, radius)
}

function setPixel(x, y, color) {
  if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return
  const idx = (Math.floor(y) * WIDTH + Math.floor(x)) * 4
  const alpha = color[3] / 255
  pixels[idx] = clamp(pixels[idx] * (1 - alpha) + color[0] * alpha)
  pixels[idx + 1] = clamp(pixels[idx + 1] * (1 - alpha) + color[1] * alpha)
  pixels[idx + 2] = clamp(pixels[idx + 2] * (1 - alpha) + color[2] * alpha)
  pixels[idx + 3] = 255
}

function distance(x, y, cx, cy) {
  return Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
}

function clamp(value) {
  return Math.max(0, Math.min(255, Math.round(value)))
}

const FONT = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01111", "10000", "10000", "10011", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  J: ["00111", "00010", "00010", "00010", "10010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  "6": ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
  "?": ["01110", "10001", "00001", "00010", "00100", "00000", "00100"]
}

main()

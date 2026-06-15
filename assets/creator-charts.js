/**
 * DSTS Layer 3 — Creator Economy Charts
 * Vanilla JS canvas charts (no external dependency).
 * Supports: line chart (revenue), bar chart (retention), doughnut (stream breakdown).
 */
(function () {
  if (window.DSTSCharts) return;

  window.DSTSCharts = {
    defaults: {
      width: 600,
      height: 240,
      padding: { top: 20, right: 20, bottom: 30, left: 50 },
      colors: {
        line: '#d8bc77',
        lineFill: 'rgba(216,188,119,0.12)',
        bar: '#60a5fa',
        barHover: '#93c5fd',
        grid: 'rgba(255,255,255,0.06)',
        text: '#9aa7b4',
        textStrong: '#e6edf3'
      }
    },

    renderLineChart(container, data, opts) {
      const { labels, values } = data;
      const o = { ...this.defaults, ...opts };
      const canvas = document.createElement('canvas');
      canvas.width = o.width;
      canvas.height = o.height;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      canvas.width = o.width * dpr;
      canvas.height = o.height * dpr;
      canvas.style.width = o.width + 'px';
      canvas.style.height = o.height + 'px';
      ctx.scale(dpr, dpr);

      const p = o.padding;
      const chartW = o.width - p.left - p.right;
      const chartH = o.height - p.top - p.bottom;
      const maxV = Math.max(...values, 1);
      const minV = Math.min(...values, 0);
      const range = maxV - minV || 1;

      // Grid lines
      ctx.strokeStyle = o.colors.grid;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = p.top + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(p.left, y);
        ctx.lineTo(o.width - p.right, y);
        ctx.stroke();
      }

      // Y labels
      ctx.fillStyle = o.colors.text;
      ctx.font = '11px Inter, system-ui';
      ctx.textAlign = 'right';
      for (let i = 0; i <= 4; i++) {
        const val = maxV - (range / 4) * i;
        const y = p.top + (chartH / 4) * i + 3;
        ctx.fillText(this.formatNumber(val), p.left - 8, y);
      }

      // X labels
      ctx.textAlign = 'center';
      const stepX = chartW / (labels.length - 1 || 1);
      labels.forEach((label, i) => {
        const x = p.left + stepX * i;
        ctx.fillText(label, x, o.height - 8);
      });

      // Area fill
      ctx.beginPath();
      ctx.moveTo(p.left, p.top + chartH);
      values.forEach((v, i) => {
        const x = p.left + stepX * i;
        const y = p.top + chartH - ((v - minV) / range) * chartH;
        ctx.lineTo(x, y);
      });
      ctx.lineTo(p.left + stepX * (values.length - 1), p.top + chartH);
      ctx.closePath();
      ctx.fillStyle = o.colors.lineFill;
      ctx.fill();

      // Line
      ctx.beginPath();
      values.forEach((v, i) => {
        const x = p.left + stepX * i;
        const y = p.top + chartH - ((v - minV) / range) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = o.colors.line;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Points
      values.forEach((v, i) => {
        const x = p.left + stepX * i;
        const y = p.top + chartH - ((v - minV) / range) * chartH;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#0b0f14';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = o.colors.line;
        ctx.stroke();
      });

      container.appendChild(canvas);
      return canvas;
    },

    renderBarChart(container, data, opts) {
      const { labels, values } = data;
      const o = { ...this.defaults, ...opts };
      const canvas = document.createElement('canvas');
      const dpr = window.devicePixelRatio || 1;
      canvas.width = o.width * dpr;
      canvas.height = o.height * dpr;
      canvas.style.width = o.width + 'px';
      canvas.style.height = o.height + 'px';
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      const p = o.padding;
      const chartW = o.width - p.left - p.right;
      const chartH = o.height - p.top - p.bottom;
      const maxV = Math.max(...values, 1);
      const barCount = values.length;
      const barGap = 8;
      const barW = (chartW - barGap * (barCount - 1)) / barCount;

      // Grid
      ctx.strokeStyle = o.colors.grid;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = p.top + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(p.left, y);
        ctx.lineTo(o.width - p.right, y);
        ctx.stroke();
      }

      // Y labels (percentages)
      ctx.fillStyle = o.colors.text;
      ctx.font = '11px Inter, system-ui';
      ctx.textAlign = 'right';
      for (let i = 0; i <= 4; i++) {
        const val = Math.round((maxV / 4) * (4 - i));
        const y = p.top + (chartH / 4) * i + 3;
        ctx.fillText(val + '%', p.left - 8, y);
      }

      // Bars
      values.forEach((v, i) => {
        const x = p.left + i * (barW + barGap);
        const barH = (v / maxV) * chartH;
        const y = p.top + chartH - barH;

        // Bar
        ctx.fillStyle = o.colors.bar;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, 4);
        ctx.fill();

        // Label
        ctx.fillStyle = o.colors.text;
        ctx.textAlign = 'center';
        ctx.fillText(labels[i] || '', x + barW / 2, o.height - 8);
      });

      container.appendChild(canvas);
      return canvas;
    },

    renderDoughnut(container, data, opts) {
      const { labels, values } = data;
      const o = { ...this.defaults, width: 200, height: 200, ...opts };
      const canvas = document.createElement('canvas');
      const dpr = window.devicePixelRatio || 1;
      canvas.width = o.width * dpr;
      canvas.height = o.height * dpr;
      canvas.style.width = o.width + 'px';
      canvas.style.height = o.height + 'px';
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      const colors = ['#d8bc77', '#60a5fa', '#a78bfa', '#4ade80', '#fbbf24', '#f87171'];
      const total = values.reduce((a, b) => a + b, 0) || 1;
      const cx = o.width / 2;
      const cy = o.height / 2;
      const radius = Math.min(cx, cy) - 20;
      const innerR = radius * 0.55;

      let startAngle = -Math.PI / 2;
      values.forEach((v, i) => {
        const angle = (v / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAngle, startAngle + angle);
        ctx.arc(cx, cy, innerR, startAngle + angle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        startAngle += angle;
      });

      // Center text
      ctx.fillStyle = o.colors.textStrong;
      ctx.font = 'bold 16px Inter, system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Total', cx, cy - 8);
      ctx.font = 'bold 20px Inter, system-ui';
      ctx.fillText(this.formatNumber(total), cx, cy + 12);

      container.appendChild(canvas);
      return canvas;
    },

    formatNumber(n) {
      if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
      if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
      if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k';
      return Math.round(n).toString();
    }
  };
})();

// Trigonometric Canvas Application
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

// アプリケーションの状態
let canvasSize = 0;
let dpr = 1;

// 角度 (ラジアン): 初期値は上へ30度 (+30度 = Math.PI / 6)
let currentAngle = (30 * Math.PI) / 180;
let isDragging = false;

// 画面サイズに合わせてCanvasをフィット（正方形）
function resizeCanvas() {
  dpr = window.devicePixelRatio || 1;
  const minDimension = Math.min(window.innerWidth, window.innerHeight);
  canvasSize = Math.max(200, Math.floor(minDimension));

  canvas.width = canvasSize * dpr;
  canvas.height = canvasSize * dpr;
  canvas.style.width = `${canvasSize}px`;
  canvas.style.height = `${canvasSize}px`;

  render();
}

window.addEventListener('resize', resizeCanvas);

// マウス・ポインター座標の取得（CSSピクセル単位）
function getCanvasCoordinates(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

// 領域1（右上）の範囲内かどうか判定
function isInRegion1(x, y) {
  const half = canvasSize / 2;
  return x >= half && x <= canvasSize && y >= 0 && y <= half;
}

// マウスイベントリスナー
canvas.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return; // 左クリックのみ

  const pos = getCanvasCoordinates(e);
  if (isInRegion1(pos.x, pos.y)) {
    isDragging = true;
    canvas.setPointerCapture(e.pointerId);
    updateAngleFromMouse(pos.x, pos.y);
  }
});

canvas.addEventListener('pointermove', (e) => {
  const pos = getCanvasCoordinates(e);

  // カーソルスタイルの制御
  if (isDragging) {
    canvas.style.cursor = 'grabbing';
  } else if (isInRegion1(pos.x, pos.y)) {
    canvas.style.cursor = 'grab';
  } else {
    canvas.style.cursor = 'default';
  }

  if (isDragging) {
    updateAngleFromMouse(pos.x, pos.y);
  }
});

function stopDrag(e) {
  if (isDragging) {
    isDragging = false;
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch (_) {}
    canvas.style.cursor = 'default';
  }
}

canvas.addEventListener('pointerup', stopDrag);
canvas.addEventListener('pointercancel', stopDrag);
window.addEventListener('pointerup', stopDrag);

// マウス座標から原点(領域1の中心: 右上)への角度を計算して更新
function updateAngleFromMouse(mouseX, mouseY) {
  const originX = (canvasSize * 3) / 4;
  const originY = canvasSize / 4;

  const dx = mouseX - originX;
  // Canvas座標系は下向きが正なので、数学座標系（上向きが正）に変換
  const dy = -(mouseY - originY);

  if (dx === 0 && dy === 0) return;

  currentAngle = Math.atan2(dy, dx);
  render();
}

// 描画メイン処理
function render() {
  ctx.save();
  ctx.scale(dpr, dpr);

  // 背景クリア
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  const half = canvasSize / 2;

  // 1. y=+1, y=-1 の水平ガイド線（領域2から領域1まで延長）
  drawAmplitudeGuides(half);

  // 2. x=+1, x=-1 の垂直ガイド線（領域1から領域4まで延長）
  drawCosAmplitudeGuides(half);

  // 3. sin(θ) の高さを示す水平破線（左端からcanvasの右端まで延長）
  drawSinHorizontalLine(half);

  // 4. cos(θ) の横位置を示す垂直破線（上端からcanvasの下端まで延長）
  drawCosVerticalLine(half);

  // 5. 4分割線を描画
  drawDividers(half);

  // 6. 領域1の内容を描画（単位円と直角三角形）
  drawRegion1(half);

  // 7. 領域2の内容を描画（sin関数のグラフ）
  drawRegion2(half);

  // 8. 領域3の内容を描画（tan関数のグラフ）
  drawRegion3(half);

  // 9. 領域4の内容を描画（cos関数のグラフ）
  drawRegion4(half);

  ctx.restore();
}

// 中心を通る水平・垂直の直線（4分割線）
function drawDividers(half) {
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  // 水平線
  ctx.moveTo(0, half);
  ctx.lineTo(canvasSize, half);
  // 垂直線
  ctx.moveTo(half, 0);
  ctx.lineTo(half, canvasSize);
  ctx.stroke();
}

// y=+1, y=-1 の水平ガイド線（領域2から領域1まで延長）
function drawAmplitudeGuides(half) {
  const originY = half / 2;
  const circleRadius = (half * 0.8) / 2;

  ctx.save();
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.35)'; // ガイド線
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 4]);

  ctx.beginPath();
  // +1 の水平線 (領域2の左端から領域1の右端まで延長)
  ctx.moveTo(0, originY - circleRadius);
  ctx.lineTo(canvasSize, originY - circleRadius);
  // -1 の水平線 (領域2の左端から領域1の右端まで延長)
  ctx.moveTo(0, originY + circleRadius);
  ctx.lineTo(canvasSize, originY + circleRadius);
  ctx.stroke();

  // ±1 のラベル（領域2の左側に表示）
  ctx.font = '11px monospace';
  ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText('+1', 8, originY - circleRadius - 2);
  ctx.textBaseline = 'top';
  ctx.fillText('-1', 8, originY + circleRadius + 2);

  ctx.restore();
}

// x=+1, x=-1 の垂直ガイド線（領域1から領域4まで延長）
function drawCosAmplitudeGuides(half) {
  const originX1 = half + half / 2;
  const circleRadius = (half * 0.8) / 2;

  ctx.save();
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.35)'; // ガイド線
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 4]);

  ctx.beginPath();
  // +1 の垂直線 (y: 0 から canvasSize まで)
  ctx.moveTo(originX1 + circleRadius, 0);
  ctx.lineTo(originX1 + circleRadius, canvasSize);
  // -1 の垂直線 (y: 0 から canvasSize まで)
  ctx.moveTo(originX1 - circleRadius, 0);
  ctx.lineTo(originX1 - circleRadius, canvasSize);
  ctx.stroke();

  // ±1 のラベル（領域4の下端、ガイド線の右横に表示）
  ctx.font = '11px monospace';
  ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
  ctx.textBaseline = 'bottom';
  ctx.textAlign = 'left';
  ctx.fillText('+1', originX1 + circleRadius + 4, canvasSize - 20);
  ctx.fillText('-1', originX1 - circleRadius + 4, canvasSize - 20);

  ctx.restore();
}

// θの90度ごとの垂直な薄い破線を描画（領域2および領域3用）
function drawAngleGridV(half, yTop, yBottom, axisY, centerX, pixelsPerRad) {
  const step = Math.PI / 2; // 90度
  const tMin = currentAngle - centerX / pixelsPerRad;
  const tMax = currentAngle + (half - centerX) / pixelsPerRad;

  const kMin = Math.ceil(tMin / step);
  const kMax = Math.floor(tMax / step);

  ctx.save();
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)'; // 薄い破線
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 4]);

  for (let k = kMin; k <= kMax; k++) {
    const t = k * step;
    const x = centerX + (t - currentAngle) * pixelsPerRad;
    ctx.beginPath();
    ctx.moveTo(x, yTop);
    ctx.lineTo(x, yBottom);
    ctx.stroke();
  }
  ctx.restore();
}

// θの90度ごとの水平な薄い破線を描画（領域4用）
function drawAngleGridH(half, axisX, centerY, pixelsPerRad) {
  const step = Math.PI / 2; // 90度
  const tMin = currentAngle - (centerY - half) / pixelsPerRad;
  const tMax = currentAngle + (canvasSize - centerY) / pixelsPerRad;

  const kMin = Math.ceil(tMin / step);
  const kMax = Math.floor(tMax / step);

  ctx.save();
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)'; // 薄い破線
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 4]);

  for (let k = kMin; k <= kMax; k++) {
    const t = k * step;
    const y = centerY + (t - currentAngle) * pixelsPerRad;
    ctx.beginPath();
    ctx.moveTo(half, y);
    ctx.lineTo(canvasSize, y);
    ctx.stroke();
  }
  ctx.restore();
}

// 領域1（右上）のコンテンツ描画
function drawRegion1(half) {
  const originX = half + half / 2;
  const originY = half / 2;

  // 直径が領域1の横幅の80%程度の円
  const circleRadius = (half * 0.8) / 2;

  // A. X軸とY軸を描画
  drawAxes(half, originX, originY);

  // B. 中心が原点の円を描画
  drawUnitCircle(originX, originY, circleRadius);

  // C. 直角三角形を変形して描画
  drawTriangle(originX, originY, circleRadius, currentAngle);
}

// 領域2（左上）のコンテンツ描画（sin関数のグラフ）
function drawRegion2(half) {
  const originY = half / 2; // 領域1の原点と同じ高さ (Y=0)
  const centerX2 = half / 2; // 領域2のX方向中央（ここが角度θの位置）
  const circleRadius = (half * 0.8) / 2; // Y方向スケール（円の半径と同じサイズが1）
  const pixelsPerRad = half / (2 * Math.PI); // X方向スケール（領域2の横幅でちょうど1周期 2π）

  ctx.save();
  // 領域2の枠内にクリッピング（はみ出し防止）
  ctx.beginPath();
  ctx.rect(0, 0, half, half);
  ctx.clip();

  // 1. θの90度ごとの垂直の薄い破線
  drawAngleGridV(half, 0, half, originY, centerX2, pixelsPerRad);

  // 2. X軸の描画（Y=0 の線。Y軸は描画しない）
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, originY);
  ctx.lineTo(half, originY);
  ctx.stroke();

  // X軸の矢印
  const arrowSize = 6;
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(half - 2, originY);
  ctx.lineTo(half - 2 - arrowSize, originY - arrowSize / 1.5);
  ctx.lineTo(half - 2 - arrowSize, originY + arrowSize / 1.5);
  ctx.closePath();
  ctx.fill();

  // 3. sin関数の波形を描画
  // 線色は領域1の円周と同じ色 (#38bdf8)、実線
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([]); // 実線
  ctx.beginPath();
  for (let x = 0; x <= half; x += 2) {
    const t = currentAngle + (x - centerX2) / pixelsPerRad;
    const y = originY - Math.sin(t) * circleRadius;
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  // 4. sin(θ) の高さを計算
  const sinY = originY - Math.sin(currentAngle) * circleRadius;

  // 5. sin(θ) の点からX軸までの垂線を描画（領域1の三角形の垂線と同じ色 #f43f5e）
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 2;
  ctx.setLineDash([]); // 実線
  ctx.beginPath();
  ctx.moveTo(centerX2, originY);
  ctx.lineTo(centerX2, sinY);
  ctx.stroke();

  // 垂線の足の直角マーク
  if (Math.abs(sinY - originY) > 8) {
    const signY = sinY < originY ? -1 : 1;
    const markSize = 8;
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(centerX2 + markSize, originY);
    ctx.lineTo(centerX2 + markSize, originY + signY * markSize);
    ctx.lineTo(centerX2, originY + signY * markSize);
    ctx.stroke();
  }

  // 6. sin(θ) の位置に点（中央）を表示
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX2, sinY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 7. 中央のθの位置ラベル
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('θ', centerX2, originY + 6);

  // 8. 右上に sin の値を表示
  ctx.font = '12px monospace';
  ctx.fillStyle = '#e2e8f0';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText(`sin = ${Math.sin(currentAngle).toFixed(3)}`, half - 12, 12);

  ctx.restore();
}

// 領域3（左下）のコンテンツ描画（tan関数のグラフ）
function drawRegion3(half) {
  const centerY3 = half + half / 2; // 領域3の垂直中央 (Y=0 のX軸)
  const centerX3 = half / 2; // 領域3の水平中央 (ここが角度θの位置)
  const circleRadius = (half * 0.8) / 2;
  const pixelsPerRad = half / (2 * Math.PI); // X方向スケール（領域2と一致）
  const scaleY = circleRadius * 0.5; // Y方向スケール（tanカーブが自然に見える比率）

  ctx.save();
  // 領域3の枠内にクリッピング（はみ出し防止）
  ctx.beginPath();
  ctx.rect(0, half, half, half);
  ctx.clip();

  // 1. θの90度ごとの垂直の薄い破線
  drawAngleGridV(half, half, canvasSize, centerY3, centerX3, pixelsPerRad);

  // 2. X軸の描画（Y=0 の線。Y軸は描画しない）
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, centerY3);
  ctx.lineTo(half, centerY3);
  ctx.stroke();

  // X軸の矢印
  const arrowSize = 6;
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(half - 2, centerY3);
  ctx.lineTo(half - 2 - arrowSize, centerY3 - arrowSize / 1.5);
  ctx.lineTo(half - 2 - arrowSize, centerY3 + arrowSize / 1.5);
  ctx.closePath();
  ctx.fill();

  // 3. tan関数の波形を描画
  // 線色は領域1の円周と同じ色 (#38bdf8)、実線
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([]); // 実線

  ctx.beginPath();
  let prevBranch = null;
  let prevY = null;

  for (let x = 0; x <= half; x += 1) {
    const t = currentAngle + (x - centerX3) / pixelsPerRad;

    // 漸近線 (π/2 + kπ) のブランチ番号を計算して跨ぎを判定
    const branch = Math.floor((t - Math.PI / 2) / Math.PI);
    if (prevBranch !== null && branch !== prevBranch) {
      // 漸近線を跨いだので一度描画してパスを再開
      ctx.stroke();
      ctx.beginPath();
      prevY = null;
    }
    prevBranch = branch;

    const cosVal = Math.cos(t);
    if (Math.abs(cosVal) < 1e-4) {
      ctx.stroke();
      ctx.beginPath();
      prevY = null;
      continue;
    }

    const tanVal = Math.tan(t);
    const y = centerY3 - tanVal * scaleY;
    const clampedY = Math.max(half - 50, Math.min(canvasSize + 50, y));

    if (prevY === null) {
      ctx.moveTo(x, clampedY);
    } else {
      ctx.lineTo(x, clampedY);
    }
    prevY = clampedY;
  }
  ctx.stroke();

  // 4. tan(θ) の値を計算
  const cosCur = Math.cos(currentAngle);
  const tanCur = Math.abs(cosCur) > 1e-4 ? Math.tan(currentAngle) : (Math.sin(currentAngle) > 0 ? 9999 : -9999);
  const tanY = centerY3 - tanCur * scaleY;

  // 5. tan(θ) の点からX軸への垂線を描画
  const tanColor = '#a855f7'; // パープル
  ctx.strokeStyle = tanColor;
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(centerX3, centerY3);
  ctx.lineTo(centerX3, tanY);
  ctx.stroke();

  // 垂線の足の直角マーク
  if (Math.abs(tanY - centerY3) > 8) {
    const signY = tanY < centerY3 ? -1 : 1;
    const markSize = 8;
    ctx.strokeStyle = tanColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(centerX3 + markSize, centerY3);
    ctx.lineTo(centerX3 + markSize, centerY3 + signY * markSize);
    ctx.lineTo(centerX3, centerY3 + signY * markSize);
    ctx.stroke();
  }

  // 6. tan(θ) の位置に点を表示
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = tanColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX3, tanY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 7. 中央のθの位置ラベル
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('θ', centerX3, centerY3 + 6);

  // 8. 右上に tan の値を表示
  ctx.font = '12px monospace';
  ctx.fillStyle = '#e2e8f0';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  const tanText = Math.abs(cosCur) > 1e-4 ? Math.tan(currentAngle).toFixed(3) : '±∞';
  ctx.fillText(`tan = ${tanText}`, half - 12, half + 12);

  ctx.restore();
}

// 領域4（右下）のコンテンツ描画（cos関数のグラフ）
function drawRegion4(half) {
  const originX1 = half + half / 2; // 領域1の原点と同じX位置 (X=0)
  const centerY4 = half + half / 2; // 領域4のY方向中央（ここが角度θの位置）
  const circleRadius = (half * 0.8) / 2; // X方向スケール（円の半径と同じサイズが1）
  const pixelsPerRad = half / (2 * Math.PI); // Y方向スケール（領域4の縦幅でちょうど1周期 2π）

  ctx.save();
  // 領域4の枠内にクリッピング（はみ出し防止）
  ctx.beginPath();
  ctx.rect(half, half, half, half);
  ctx.clip();

  // 1. θの90度ごとの水平の薄い破線
  drawAngleGridH(half, originX1, centerY4, pixelsPerRad);

  // 2. Y軸の描画（X=0 の線。X軸は描画しない）
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(originX1, half);
  ctx.lineTo(originX1, canvasSize);
  ctx.stroke();

  // Y軸の矢印
  const arrowSize = 6;
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(originX1, canvasSize - 2);
  ctx.lineTo(originX1 - arrowSize / 1.5, canvasSize - 2 - arrowSize);
  ctx.lineTo(originX1 + arrowSize / 1.5, canvasSize - 2 - arrowSize);
  ctx.closePath();
  ctx.fill();

  // 3. cos関数の波形を描画
  // 線色は領域1の円周と同じ色 (#38bdf8)、実線
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([]); // 実線
  ctx.beginPath();
  for (let y = half; y <= canvasSize; y += 2) {
    const t = currentAngle + (y - centerY4) / pixelsPerRad;
    const x = originX1 + Math.cos(t) * circleRadius;
    if (y === half) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  // 4. cos(θ) のX座標を計算
  const cosX = originX1 + Math.cos(currentAngle) * circleRadius;

  // 5. cos(θ) の点からY軸までの垂線を描画（領域1の三角形の底辺と同じ色 #10b981）
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.setLineDash([]); // 実線
  ctx.beginPath();
  ctx.moveTo(originX1, centerY4);
  ctx.lineTo(cosX, centerY4);
  ctx.stroke();

  // 垂線の足の直角マーク
  if (Math.abs(cosX - originX1) > 8) {
    const signX = cosX > originX1 ? 1 : -1;
    const markSize = 8;
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(originX1, centerY4 - markSize);
    ctx.lineTo(originX1 + signX * markSize, centerY4 - markSize);
    ctx.lineTo(originX1 + signX * markSize, centerY4);
    ctx.stroke();
  }

  // 6. cos(θ) の位置に点（中央）を表示
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cosX, centerY4, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 7. 中央のθの位置ラベル
  ctx.font = '11px monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('θ', originX1 - 8, centerY4);

  // 8. 右上に cos の値を表示
  ctx.font = '12px monospace';
  ctx.fillStyle = '#e2e8f0';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText(`cos = ${Math.cos(currentAngle).toFixed(3)}`, canvasSize - 12, half + 12);

  ctx.restore();
}

// sin(θ) の高さを示す水平破線（canvasの左端から右端まで一貫して描画）
function drawSinHorizontalLine(half) {
  const originY = half / 2;
  const circleRadius = (half * 0.8) / 2;
  const sinY = originY - Math.sin(currentAngle) * circleRadius;

  ctx.save();
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  // 左端 (0) から canvas の右端 (canvasSize) まで一本の破線を描画
  ctx.moveTo(0, sinY);
  ctx.lineTo(canvasSize, sinY);
  ctx.stroke();
  ctx.restore();
}

// cos(θ) の横位置を示す垂直破線（canvasの上端から下端まで一貫して描画）
function drawCosVerticalLine(half) {
  const originX1 = half + half / 2;
  const circleRadius = (half * 0.8) / 2;
  const cosX = originX1 + Math.cos(currentAngle) * circleRadius;

  ctx.save();
  ctx.strokeStyle = '#10b981'; // エメラルドグリーン
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  // 上端 (0) から canvas の下端 (canvasSize) まで一本の破線を描画
  ctx.moveTo(cosX, 0);
  ctx.lineTo(cosX, canvasSize);
  ctx.stroke();
  ctx.restore();
}

// X軸とY軸の描画（領域1: 右上）
function drawAxes(half, originX, originY) {
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;

  // X軸 (x: half から canvasSize まで)
  ctx.beginPath();
  ctx.moveTo(half, originY);
  ctx.lineTo(canvasSize, originY);
  ctx.stroke();

  // Y軸 (y: 0 から half まで)
  ctx.beginPath();
  ctx.moveTo(originX, 0);
  ctx.lineTo(originX, half);
  ctx.stroke();

  // 軸の矢印とラベル
  const arrowSize = 6;
  const font = `11px sans-serif`;
  ctx.font = font;
  ctx.fillStyle = '#94a3b8';

  // X軸の矢印 & ラベル
  ctx.beginPath();
  ctx.moveTo(canvasSize - 2, originY);
  ctx.lineTo(canvasSize - 2 - arrowSize, originY - arrowSize / 1.5);
  ctx.lineTo(canvasSize - 2 - arrowSize, originY + arrowSize / 1.5);
  ctx.closePath();
  ctx.fill();
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText('X', canvasSize - 10, originY - 6);

  // Y軸の矢印 & ラベル
  ctx.beginPath();
  ctx.moveTo(originX, 2);
  ctx.lineTo(originX - arrowSize / 1.5, 2 + arrowSize);
  ctx.lineTo(originX + arrowSize / 1.5, 2 + arrowSize);
  ctx.closePath();
  ctx.fill();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Y', originX + 6, 4);

  // 原点 O のラベル
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('O', originX - 4, originY + 4);
}

// 円の描画
function drawUnitCircle(originX, originY, radius) {
  ctx.save();
  ctx.strokeStyle = '#38bdf8'; // シアンブルー
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]); // 破線で補助円らしく軽快に
  ctx.beginPath();
  ctx.arc(originX, originY, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// 三角形の描画
function drawTriangle(originX, originY, radius, theta) {
  const cosVal = Math.cos(theta);
  const sinVal = Math.sin(theta);

  // 頂点1: 原点 (0, 0)
  const pOrigin = { x: originX, y: originY };

  // 頂点2: 円周上の点 (R * cos(θ), R * sin(θ))
  // Canvas座標系では上向きが -y
  const pCircle = {
    x: originX + radius * cosVal,
    y: originY - radius * sinVal,
  };

  // 頂点3: 円周上の点からX軸に下ろした垂線とX軸との交点 (R * cos(θ), 0)
  const pFoot = {
    x: originX + radius * cosVal,
    y: originY,
  };

  // 1. 三角形の面（半透明の塗りつぶし）
  ctx.fillStyle = 'rgba(56, 189, 248, 0.2)'; // 鮮やかな水色の半透明
  ctx.beginPath();
  ctx.moveTo(pOrigin.x, pOrigin.y);
  ctx.lineTo(pFoot.x, pFoot.y);
  ctx.lineTo(pCircle.x, pCircle.y);
  ctx.closePath();
  ctx.fill();

  // 2. 角度の円弧 (θ)
  drawAngleArc(originX, originY, radius, theta);

  // 3. 直角マーク（垂線の足の直角マーク）
  drawRightAngleMark(pFoot, pOrigin, pCircle);

  // 4. 三角形の各辺を描画
  // 底辺 (X軸上の線分: cosθ)
  ctx.strokeStyle = '#10b981'; // エメラルドグリーンで底辺(cos)を強調
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pOrigin.x, pOrigin.y);
  ctx.lineTo(pFoot.x, pFoot.y);
  ctx.stroke();

  // 対辺 (垂線: sinθ)
  ctx.strokeStyle = '#f43f5e'; // ローズピンクで垂線(sin)を強調
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pFoot.x, pFoot.y);
  ctx.lineTo(pCircle.x, pCircle.y);
  ctx.stroke();

  // 斜辺 (原点から円周上の点への直線)
  ctx.strokeStyle = '#38bdf8'; // 明るいシアン
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(pOrigin.x, pOrigin.y);
  ctx.lineTo(pCircle.x, pCircle.y);
  ctx.stroke();

  // 5. 円周上の頂点（ドラッグ可能なハンドル点）
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(pCircle.x, pCircle.y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 6. 角度や値の情報テキスト表示（右上などに見やすく）
  drawAngleInfo(theta);
}

// 角度の扇形/円弧を描画
function drawAngleArc(originX, originY, radius, theta) {
  let normAngle = theta;
  while (normAngle < 0) normAngle += Math.PI * 2;
  while (normAngle >= Math.PI * 2) normAngle -= Math.PI * 2;

  if (normAngle < 1e-4) return;

  const arcRadius = Math.min(32, radius * 0.35);

  ctx.save();
  ctx.fillStyle = 'rgba(251, 191, 36, 0.25)'; // ゴールドの透過
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(originX, originY);
  // Canvas上では 0 から反時計回り（上向き方向）に -normAngle
  ctx.arc(originX, originY, arcRadius, 0, -normAngle, true);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

// 直角記号（∟）の描画
function drawRightAngleMark(foot, origin, circle) {
  const dxOrigin = origin.x - foot.x;
  const dyCircle = circle.y - foot.y;

  // 三角形が極端につぶれた場合は直角マークを描画しない、またはサイズを縮小する
  const maxMarkSize = 10;
  const markSize = Math.min(maxMarkSize, Math.abs(dxOrigin) * 0.6, Math.abs(dyCircle) * 0.6);

  if (markSize < 3) return;

  const signX = dxOrigin > 0 ? 1 : -1;
  const signY = dyCircle > 0 ? 1 : -1;

  ctx.save();
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(foot.x + signX * markSize, foot.y);
  ctx.lineTo(foot.x + signX * markSize, foot.y + signY * markSize);
  ctx.lineTo(foot.x, foot.y + signY * markSize);
  ctx.stroke();
  ctx.restore();
}

// 領域1の右上における角度情報表示
function drawAngleInfo(theta) {
  let deg = (theta * 180) / Math.PI;
  if (deg < 0) deg += 360;

  ctx.save();
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '12px monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';

  // 領域1の右上
  const x = canvasSize - 12;
  const y = 12;

  ctx.fillText(`θ = ${deg.toFixed(1)}°`, x, y);

  ctx.restore();
}

// 初期化実行
resizeCanvas();

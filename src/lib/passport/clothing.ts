export interface ClothingRenderParams {
  canvasWidth: number;
  canvasHeight: number;
  chinY: number; // Y position of chin in canvas coords
  neckWidth: number; // width of neck in canvas coords
  templateId: string;
}

/**
 * Draws professional clothing overlay directly onto canvas beneath the head/chin level.
 * Features realistic shadows, collar lines, suit lapels, and ties.
 */
export function drawClothingOverlay(
  ctx: CanvasRenderingContext2D,
  params: ClothingRenderParams
) {
  const { canvasWidth, canvasHeight, chinY, neckWidth, templateId } = params;

  if (templateId === 'none') return;

  ctx.save();

  const centerX = canvasWidth / 2;
  const collarY = chinY + canvasHeight * 0.03;
  const shoulderY = collarY + canvasHeight * 0.12;
  const halfNeck = Math.max(canvasWidth * 0.14, neckWidth * 0.55);

  // Clothing base trapezoid from shoulders to bottom
  const shoulderLeftX = 0;
  const shoulderRightX = canvasWidth;
  const bottomY = canvasHeight;

  // 1. Draw Suit Jackets
  if (templateId === 'formal-navy-suit' || templateId === 'formal-black-suit' || templateId === 'blazer-tie' || templateId === 'corporate-women-blazer') {
    const isNavy = templateId === 'formal-navy-suit';
    const isBlazer = templateId === 'blazer-tie';
    const isWomen = templateId === 'corporate-women-blazer';
    
    const suitColor = isNavy ? '#0f172a' : isBlazer ? '#1e293b' : isWomen ? '#111827' : '#090d16';
    const lapelColor = isNavy ? '#1e293b' : isBlazer ? '#334155' : isWomen ? '#1f2937' : '#172033';
    const shirtColor = '#ffffff';

    // Suit Torso Body
    ctx.fillStyle = suitColor;
    ctx.beginPath();
    ctx.moveTo(shoulderLeftX, shoulderY);
    // Shoulder curve to collar
    ctx.quadraticCurveTo(centerX - halfNeck * 1.5, shoulderY - canvasHeight * 0.04, centerX - halfNeck, collarY);
    ctx.lineTo(centerX + halfNeck, collarY);
    ctx.quadraticCurveTo(centerX + halfNeck * 1.5, shoulderY - canvasHeight * 0.04, shoulderRightX, shoulderY);
    ctx.lineTo(shoulderRightX, bottomY);
    ctx.lineTo(shoulderLeftX, bottomY);
    ctx.closePath();
    ctx.fill();

    // White Shirt Inner V-Chest
    ctx.fillStyle = shirtColor;
    ctx.beginPath();
    ctx.moveTo(centerX - halfNeck * 0.9, collarY);
    ctx.lineTo(centerX + halfNeck * 0.9, collarY);
    ctx.lineTo(centerX, collarY + canvasHeight * 0.28);
    ctx.closePath();
    ctx.fill();

    // Shirt Collar Wings
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;

    // Left Collar Wing
    ctx.beginPath();
    ctx.moveTo(centerX - halfNeck * 0.95, collarY - canvasHeight * 0.01);
    ctx.lineTo(centerX - halfNeck * 0.2, collarY + canvasHeight * 0.08);
    ctx.lineTo(centerX - halfNeck * 0.7, collarY + canvasHeight * 0.09);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right Collar Wing
    ctx.beginPath();
    ctx.moveTo(centerX + halfNeck * 0.95, collarY - canvasHeight * 0.01);
    ctx.lineTo(centerX + halfNeck * 0.2, collarY + canvasHeight * 0.08);
    ctx.lineTo(centerX + halfNeck * 0.7, collarY + canvasHeight * 0.09);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (!isWomen) {
      // Tie
      const tieColor = isNavy ? '#991b1b' : isBlazer ? '#0284c7' : '#334155';
      ctx.fillStyle = tieColor;
      
      // Tie Knot
      ctx.beginPath();
      ctx.moveTo(centerX - halfNeck * 0.22, collarY + canvasHeight * 0.06);
      ctx.lineTo(centerX + halfNeck * 0.22, collarY + canvasHeight * 0.06);
      ctx.lineTo(centerX + halfNeck * 0.16, collarY + canvasHeight * 0.11);
      ctx.lineTo(centerX - halfNeck * 0.16, collarY + canvasHeight * 0.11);
      ctx.closePath();
      ctx.fill();

      // Tie Body
      ctx.beginPath();
      ctx.moveTo(centerX - halfNeck * 0.16, collarY + canvasHeight * 0.11);
      ctx.lineTo(centerX + halfNeck * 0.16, collarY + canvasHeight * 0.11);
      ctx.lineTo(centerX + halfNeck * 0.28, bottomY);
      ctx.lineTo(centerX, bottomY + canvasHeight * 0.02);
      ctx.lineTo(centerX - halfNeck * 0.28, bottomY);
      ctx.closePath();
      ctx.fill();

      // Tie highlights
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX - halfNeck * 0.1, collarY + canvasHeight * 0.12);
      ctx.lineTo(centerX - halfNeck * 0.15, bottomY);
      ctx.stroke();
    }

    // Suit Lapels (Front flaps)
    ctx.fillStyle = lapelColor;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 2;

    // Left Lapel
    ctx.beginPath();
    ctx.moveTo(centerX - halfNeck, collarY);
    ctx.lineTo(centerX - halfNeck * 1.6, shoulderY + canvasHeight * 0.02);
    ctx.lineTo(centerX - halfNeck * 0.8, shoulderY + canvasHeight * 0.05);
    ctx.lineTo(centerX - halfNeck * 0.1, collarY + canvasHeight * 0.32);
    ctx.lineTo(shoulderLeftX, bottomY);
    ctx.lineTo(shoulderLeftX, shoulderY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right Lapel
    ctx.beginPath();
    ctx.moveTo(centerX + halfNeck, collarY);
    ctx.lineTo(centerX + halfNeck * 1.6, shoulderY + canvasHeight * 0.02);
    ctx.lineTo(centerX + halfNeck * 0.8, shoulderY + canvasHeight * 0.05);
    ctx.lineTo(centerX + halfNeck * 0.1, collarY + canvasHeight * 0.32);
    ctx.lineTo(shoulderRightX, bottomY);
    ctx.lineTo(shoulderRightX, shoulderY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Subtle collar shadow beneath chin
    const shadowGrad = ctx.createLinearGradient(centerX, collarY - 15, centerX, collarY + 20);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.fillRect(centerX - halfNeck * 1.2, collarY - 10, halfNeck * 2.4, 30);
  }

  // 2. Draw Formal Button-Down Shirts (White, Sky Blue, School)
  else if (templateId === 'white-formal-shirt' || templateId === 'sky-blue-shirt' || templateId === 'school-uniform') {
    const isBlue = templateId === 'sky-blue-shirt';
    const isSchool = templateId === 'school-uniform';
    const shirtColor = isBlue ? '#7dd3fc' : isSchool ? '#f1f5f9' : '#ffffff';
    const shadowColor = isBlue ? '#38bdf8' : '#e2e8f0';

    // Shirt Body
    ctx.fillStyle = shirtColor;
    ctx.beginPath();
    ctx.moveTo(shoulderLeftX, shoulderY);
    ctx.quadraticCurveTo(centerX - halfNeck * 1.4, shoulderY - canvasHeight * 0.03, centerX - halfNeck, collarY);
    ctx.lineTo(centerX + halfNeck, collarY);
    ctx.quadraticCurveTo(centerX + halfNeck * 1.4, shoulderY - canvasHeight * 0.03, shoulderRightX, shoulderY);
    ctx.lineTo(shoulderRightX, bottomY);
    ctx.lineTo(shoulderLeftX, bottomY);
    ctx.closePath();
    ctx.fill();

    // Center placket
    ctx.fillStyle = shadowColor;
    ctx.fillRect(centerX - halfNeck * 0.18, collarY + canvasHeight * 0.08, halfNeck * 0.36, bottomY - collarY);

    // Buttons
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    for (let bY = collarY + canvasHeight * 0.14; bY < bottomY; bY += canvasHeight * 0.09) {
      ctx.beginPath();
      ctx.arc(centerX, bY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Shirt Collars
    ctx.fillStyle = shirtColor;
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;

    // Left Collar Wing
    ctx.beginPath();
    ctx.moveTo(centerX - halfNeck * 1.05, collarY - 5);
    ctx.lineTo(centerX - halfNeck * 0.15, collarY + canvasHeight * 0.09);
    ctx.lineTo(centerX - halfNeck * 0.75, collarY + canvasHeight * 0.11);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right Collar Wing
    ctx.beginPath();
    ctx.moveTo(centerX + halfNeck * 1.05, collarY - 5);
    ctx.lineTo(centerX + halfNeck * 0.15, collarY + canvasHeight * 0.09);
    ctx.lineTo(centerX + halfNeck * 0.75, collarY + canvasHeight * 0.11);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Subtle neck shadow
    const shadowGrad = ctx.createLinearGradient(centerX, collarY - 15, centerX, collarY + 20);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.fillRect(centerX - halfNeck * 1.2, collarY - 10, halfNeck * 2.4, 25);
  }

  ctx.restore();
}

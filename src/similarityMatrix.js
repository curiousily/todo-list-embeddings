import { interpolateReds } from "d3-scale-chromatic";

const renderSimilarityMatrix = async (model, sentences) => {
  const embeddings = await model.embed(sentences);

  const matrixSize = 250;
  const cellSize = matrixSize / sentences.length;
  const canvas = document.querySelector("canvas");
  canvas.width = matrixSize;
  canvas.height = matrixSize;

  const ctx = canvas.getContext("2d");

  const xLabelsContainer = document.querySelector(".x-axis");
  const yLabelsContainer = document.querySelector(".y-axis");

  for (let i = 0; i < sentences.length; i++) {
    const labelXDom = document.createElement("div");
    const labelYDom = document.createElement("div");

    labelXDom.textContent = i + 1;
    labelYDom.textContent = i + 1;
    labelXDom.style.left = i * cellSize + cellSize / 2 + "px";
    labelYDom.style.top = i * cellSize + cellSize / 2 + "px";

    xLabelsContainer.appendChild(labelXDom);
    yLabelsContainer.appendChild(labelYDom);

    for (let j = i; j < sentences.length; j++) {
      const sentenceI = embeddings.slice([i, 0], [1]);
      const sentenceJ = embeddings.slice([j, 0], [1]);
      const sentenceITranspose = false;
      const sentenceJTransepose = true;
      const score = sentenceI
        .matMul(sentenceJ, sentenceITranspose, sentenceJTransepose)
        .dataSync();

      ctx.fillStyle = interpolateReds(score);
      ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
};

export { renderSimilarityMatrix };

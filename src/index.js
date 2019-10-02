import * as use from "@tensorflow-models/universal-sentence-encoder";
import { renderSimilarityMatrix } from "./similarityMatrix";
import "./style.css";

const ToDos = [
  "Hit the gym",
  "Go for a run",
  "Study Math",
  "Watch Biology lectures",
  "Date with Michele",
  "Have dinner with Pam"
];

const similarityScore = async (sentenceAIndex, sentenceBIndex, embeddings) => {
  const sentenceAEmbeddings = embeddings.slice([sentenceAIndex, 0], [1]);
  const sentenceBEmbeddings = embeddings.slice([sentenceBIndex, 0], [1]);
  const sentenceATranspose = false;
  const sentenceBTransepose = true;
  const scoreData = await sentenceAEmbeddings
    .matMul(sentenceBEmbeddings, sentenceATranspose, sentenceBTransepose)
    .data();

  return scoreData[0];
};

const run = async () => {
  const model = await use.load();

  const todoEmbedding = await model.embed(ToDos[0]);
  console.log(todoEmbedding.shape);
  console.log(todoEmbedding.dataSync());

  const todoEmbeddings = await model.embed(ToDos);
  const firstPairScore = await similarityScore(0, 1, todoEmbeddings);
  console.log(`${ToDos[0]}\n${ToDos[1]}\nsimilarity: ${firstPairScore}`);

  const firstThirdScore = await similarityScore(0, 2, todoEmbeddings);
  console.log(`${ToDos[0]}\n${ToDos[2]}\nsimilarity: ${firstThirdScore}`);

  document.querySelector("#loading").style.display = "none";

  renderToDos();

  await renderSimilarityMatrix(model, ToDos);
};

const renderToDos = () => {
  ToDos.forEach((sentence, i) => {
    const sentenceDom = document.createElement("div");
    sentenceDom.textContent = `${i + 1}) ${sentence}`;
    document.querySelector("#sentences-container").appendChild(sentenceDom);
  });
};

if (document.readyState !== "loading") {
  run();
} else {
  document.addEventListener("DOMContentLoaded", run);
}

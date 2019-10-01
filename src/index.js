import * as use from "@tensorflow-models/universal-sentence-encoder";
import { renderSimilarityMatrix } from "./similarityMatrix";
import "./style.css";

const sentences = [
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

  const sentenceEmbedding = await model.embed(sentences[0]);
  console.log(sentenceEmbedding.shape);
  console.log(sentenceEmbedding.dataSync());

  const sentenceEmbeddings = await model.embed(sentences);
  const firstPairScore = await similarityScore(0, 1, sentenceEmbeddings);
  console.log(
    `${sentences[0]}\n${sentences[1]}\nsimilarity: ${firstPairScore}`
  );

  const firstThirdScore = await similarityScore(0, 2, sentenceEmbeddings);
  console.log(
    `${sentences[0]}\n${sentences[2]}\nsimilarity: ${firstThirdScore}`
  );

  document.querySelector("#loading").style.display = "none";

  renderSentences();

  await renderSimilarityMatrix(model, sentences);
};

const renderSentences = () => {
  sentences.forEach((sentence, i) => {
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

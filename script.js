// ==============================
// 英単語データ
// ==============================

const words = [
  {
    word: "apple",
    meaning: "りんご"
  },
  {
    word: "book",
    meaning: "本"
  },
  {
    word: "school",
    meaning: "学校"
  },
  {
    word: "teacher",
    meaning: "先生"
  },
  {
    word: "friend",
    meaning: "友達"
  },
  {
    word: "house",
    meaning: "家"
  },
  {
    word: "water",
    meaning: "水"
  },
  {
    word: "food",
    meaning: "食べ物"
  },
  {
    word: "dog",
    meaning: "犬"
  },
  {
    word: "cat",
    meaning: "猫"
  },
  {
    word: "car",
    meaning: "車"
  },
  {
    word: "sun",
    meaning: "太陽"
  },
  {
    word: "moon",
    meaning: "月"
  },
  {
    word: "morning",
    meaning: "朝"
  },
  {
    word: "night",
    meaning: "夜"
  },
  {
    word: "happy",
    meaning: "幸せな"
  },
  {
    word: "big",
    meaning: "大きい"
  },
  {
    word: "small",
    meaning: "小さい"
  },
  {
    word: "beautiful",
    meaning: "美しい"
  },
  {
    word: "important",
    meaning: "重要な"
  }
];


// ==============================
// クイズの設定
// ==============================

let quizWords = [];
let currentQuestion = 0;
let correctCount = 0;
let answered = false;


// ==============================
// クイズ開始
// ==============================

function startQuiz() {

  // 単語をシャッフル
  quizWords = [...words].sort(() => Math.random() - 0.5);

  // 最初の10問だけ使用
  quizWords = quizWords.slice(0, 10);

  currentQuestion = 0;
  correctCount = 0;

  showQuestion();
}


// ==============================
// 問題を表示
// ==============================

function showQuestion() {

  answered = false;

  const question = quizWords[currentQuestion];

  document.getElementById("word").textContent = question.word;

  document.getElementById("progress").textContent =
    `${currentQuestion + 1} / ${quizWords.length}`;

  document.getElementById("correct").textContent =
    correctCount;

  document.getElementById("total").textContent =
    currentQuestion;

  document.getElementById("result").textContent = "";

  document.getElementById("nextButton").style.display = "none";


  // 正解を含む4つの選択肢を作る
  let choices = [question.meaning];

  const otherMeanings = words
    .filter(item => item.meaning !== question.meaning)
    .map(item => item.meaning)
    .sort(() => Math.random() - 0.5);

  choices.push(...otherMeanings.slice(0, 3));

  // 選択肢をシャッフル
  choices.sort(() => Math.random() - 0.5);


  const choicesArea = document.getElementById("choices");

  choicesArea.innerHTML = "";


  choices.forEach((choice, index) => {

    const button = document.createElement("button");

    button.textContent = choice;

    button.onclick = function() {
      answer(choice, question.meaning);
    };

    choicesArea.appendChild(button);

  });
}


// ==============================
// 答えを判定
// ==============================

function answer(selected, correct) {

  if (answered) return;

  answered = true;

  const result = document.getElementById("result");

  const buttons = document.querySelectorAll("#choices button");


  if (selected === correct) {

    correctCount++;

    result.textContent = "⭕ 正解！";

    result.className = "correct";

  } else {

    result.textContent = `❌ 不正解…… 正解は「${correct}」`;

    result.className = "incorrect";

  }


  document.getElementById("correct").textContent =
    correctCount;

  document.getElementById("total").textContent =
    currentQuestion + 1;


  // 全ての選択肢を無効化
  buttons.forEach(button => {
    button.disabled = true;
  });


  // 次へボタンを表示
  document.getElementById("nextButton").style.display =
    "block";
}


// ==============================
// 次の問題
// ==============================

function nextQuestion() {

  currentQuestion++;

  if (currentQuestion >= quizWords.length) {

    finishQuiz();

  } else {

    showQuestion();

  }
}


// ==============================
// クイズ終了
// ==============================

function finishQuiz() {

  const percentage =
    Math.round((correctCount / quizWords.length) * 100);


  document.getElementById("word").textContent =
    "🎉 終了！";

  document.getElementById("choices").innerHTML = "";

  document.getElementById("result").textContent =
    `${quizWords.length}問中 ${correctCount}問正解！`;

  document.getElementById("progress").textContent =
    `${percentage}%`;

  document.getElementById("nextButton").style.display =
    "none";

}


// ==============================
// ページを開いたらクイズ開始
// ==============================

startQuiz();

// ==============================
// 英単語データ
// ==============================

const words = [
  { word: "apple", meaning: "りんご" },
  { word: "book", meaning: "本" },
  { word: "school", meaning: "学校" },
  { word: "teacher", meaning: "先生" },
  { word: "friend", meaning: "友達" },
  { word: "house", meaning: "家" },
  { word: "water", meaning: "水" },
  { word: "food", meaning: "食べ物" },
  { word: "dog", meaning: "犬" },
  { word: "cat", meaning: "猫" },
  { word: "car", meaning: "車" },
  { word: "sun", meaning: "太陽" },
  { word: "moon", meaning: "月" },
  { word: "morning", meaning: "朝" },
  { word: "night", meaning: "夜" },
  { word: "happy", meaning: "幸せな" },
  { word: "big", meaning: "大きい" },
  { word: "small", meaning: "小さい" },
  { word: "beautiful", meaning: "美しい" },
  { word: "important", meaning: "重要な" }
];


// ==============================
// 学習記録
// ==============================

let studyData =
  JSON.parse(localStorage.getItem("wordStudyData")) || {};


// 記録がない単語には初期値を設定
words.forEach(item => {

  if (!studyData[item.word]) {

    studyData[item.word] = {
      correct: 0,
      wrong: 0,
      streak: 0
    };

  }

});


// ==============================
// 学習記録を保存
// ==============================

function saveStudyData() {

  localStorage.setItem(
    "wordStudyData",
    JSON.stringify(studyData)
  );

}

saveStudyData();


// ==============================
// 苦手度を計算
// ==============================

function getWeakness(item) {

  const data = studyData[item.word];

  return Math.max(
    1,
    data.wrong * 3 - data.streak + 1
  );

}


// ==============================
// クイズ設定
// ==============================

let quizWords = [];
let currentQuestion = 0;
let correctCount = 0;
let answered = false;


// ==============================
// クイズを作る
// ==============================

function createQuiz() {

  let pool = [];


  words.forEach(item => {

    const weakness =
      getWeakness(item);

    // 苦手な単語ほど多く入れる
    for (let i = 0; i < weakness; i++) {

      pool.push(item);

    }

  });


  // シャッフル
  pool.sort(
    () => Math.random() - 0.5
  );


  let selected = [];


  // 同じ単語が重複しないようにする
  for (const item of pool) {

    if (
      !selected.some(
        word => word.word === item.word
      )
    ) {

      selected.push(item);

    }

    if (selected.length >= 10) {
      break;
    }

  }


  // 10問に足りない場合
  if (selected.length < 10) {

    const remaining =
      words
        .filter(
          item =>
            !selected.some(
              word =>
                word.word === item.word
            )
        )
        .sort(
          () => Math.random() - 0.5
        );

    selected.push(
      ...remaining.slice(
        0,
        10 - selected.length
      )
    );

  }


  return selected;

}


// ==============================
// クイズ開始
// ==============================

function startQuiz() {

  quizWords =
    createQuiz();

  currentQuestion = 0;

  correctCount = 0;

  showQuestion();

}


// ==============================
// 問題を表示
// ==============================

function showQuestion() {

  answered = false;


  const question =
    quizWords[currentQuestion];


  // 単語
  document.getElementById("word").textContent =
    question.word;


  // 進行状況
  document.getElementById("progress").textContent =
    `${currentQuestion + 1} / ${quizWords.length}`;


  // 正解数
  document.getElementById("correct").textContent =
    correctCount;


  // 問題数
  document.getElementById("total").textContent =
    currentQuestion;


  // 結果をリセット
  document.getElementById("result").textContent =
    "";


  // 次へボタンを隠す
  document.getElementById("nextButton").style.display =
    "none";


  // ==============================
  // 選択肢を作る
  // ==============================

  let choices = [
    question.meaning
  ];


  const otherMeanings =
    words
      .filter(
        item =>
          item.meaning !==
          question.meaning
      )
      .map(
        item => item.meaning
      )
      .sort(
        () => Math.random() - 0.5
      );


  choices.push(
    ...otherMeanings.slice(0, 3)
  );


  // シャッフル
  choices.sort(
    () => Math.random() - 0.5
  );


  const choicesArea =
    document.getElementById("choices");


  choicesArea.innerHTML = "";


  // ボタンを作る
  choices.forEach(choice => {

    const button =
      document.createElement("button");


    button.textContent =
      choice;


    button.onclick =
      function() {

        answer(
          choice,
          question.meaning
        );

      };


    choicesArea.appendChild(
      button
    );

  });

}


// ==============================
// 答えを判定
// ==============================

function answer(
  selected,
  correct
) {

  // すでに回答していたら何もしない
  if (answered) return;


  answered = true;


  const result =
    document.getElementById("result");


  const currentWord =
    quizWords[currentQuestion];


  const data =
    studyData[currentWord.word];


  // ==============================
  // 正解
  // ==============================

  if (selected === correct) {

    data.correct++;

    data.streak++;

    correctCount++;


    result.textContent =
      "⭕ 正解！";


    result.className =
      "correct";

  }


  // ==============================
  // 不正解
  // ==============================

  else {

    data.wrong++;

    data.streak = 0;


    result.textContent =
      `❌ 不正解…… 正解は「${correct}」`;


    result.className =
      "incorrect";

  }


  // 保存
  saveStudyData();


  // 正解数を更新
  document.getElementById("correct").textContent =
    correctCount;


  // 問題数を更新
  document.getElementById("total").textContent =
    currentQuestion + 1;


  // ==============================
  // 選択肢を無効化
  // ==============================

  const buttons =
    document.querySelectorAll(
      "#choices button"
    );


  buttons.forEach(button => {

    button.disabled = true;

  });


  // 次へボタン表示
  document.getElementById("nextButton").style.display =
    "block";

}


// ==============================
// 次の問題
// ==============================

function nextQuestion() {

  currentQuestion++;


  if (
    currentQuestion >=
    quizWords.length
  ) {

    finishQuiz();

  }

  else {

    showQuestion();

  }

}


// ==============================
// クイズ終了
// ==============================

function finishQuiz() {

  const percentage =
    Math.round(
      (correctCount /
        quizWords.length) *
      100
    );


  document.getElementById("word").textContent =
    "🎉 終了！";


  document.getElementById("choices").innerHTML =
    "";


  document.getElementById("result").textContent =
    `${quizWords.length}問中 ${correctCount}問正解！`;


  document.getElementById("progress").textContent =
    `${percentage}%`;


  document.getElementById("total").textContent =
    quizWords.length;


  document.getElementById("nextButton").style.display =
    "none";

}


// ==============================
// ページを開いたら開始
// ==============================

startQuiz();

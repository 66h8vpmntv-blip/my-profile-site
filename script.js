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
// 学習データ
// ==============================

let studyData =
  JSON.parse(
    localStorage.getItem("wordStudyData")
  ) || {};


// 記録がない単語を初期化

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
// 保存
// ==============================

function saveStudyData() {

  localStorage.setItem(
    "wordStudyData",
    JSON.stringify(studyData)
  );

}

saveStudyData();


// ==============================
// 定着度を取得
// ==============================

function getMasteryLevel(streak) {

  if (streak >= 5) {
    return 5;
  }

  return streak;

}


// ==============================
// 定着度の名前
// ==============================

function getMasteryText(streak) {

  if (streak >= 5) {
    return "⭐ 習得";
  }

  if (streak === 4) {
    return "💪 かなり定着";
  }

  if (streak === 3) {
    return "👍 だいぶ定着";
  }

  if (streak === 2) {
    return "📖 学習中";
  }

  if (streak === 1) {
    return "🌱 覚え始め";
  }

  return "🔥 要復習";

}


// ==============================
// 定着度の★表示
// ==============================

function getMasteryStars(streak) {

  const level =
    getMasteryLevel(streak);

  return "★".repeat(level) +
         "☆".repeat(5 - level);

}


// ==============================
// URLモード
// ==============================

const urlParams =
  new URLSearchParams(
    window.location.search
  );

const quizMode =
  urlParams.get("mode");


// ==============================
// クイズ設定
// ==============================

let quizWords = [];
let currentQuestion = 0;
let correctCount = 0;
let answered = false;


// ==============================
// 通常クイズ
// 定着していない単語を優先
// ==============================

function createNormalQuiz() {

  let pool = [];


  words.forEach(item => {

    const data =
      studyData[item.word];


    let priority = 1;


    // 苦手単語を最優先

    if (
      data.wrong >= 2 &&
      data.wrong > data.correct
    ) {

      priority += 5;

    }


    // 定着していないほど優先

    if (data.streak === 0) {

      priority += 4;

    }

    else if (data.streak === 1) {

      priority += 3;

    }

    else if (data.streak === 2) {

      priority += 2;

    }

    else if (data.streak === 3) {

      priority += 1;

    }


    // 習得済みは出題頻度を下げる

    if (data.streak >= 5) {

      priority = 1;

    }


    for (
      let i = 0;
      i < priority;
      i++
    ) {

      pool.push(item);

    }

  });


  pool.sort(
    () => Math.random() - 0.5
  );


  const selected = [];


  for (const item of pool) {

    if (
      !selected.some(
        word =>
          word.word === item.word
      )
    ) {

      selected.push(item);

    }


    if (
      selected.length >= 10
    ) {

      break;

    }

  }


  // 10問に足りない場合

  if (
    selected.length < 10
  ) {

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
// 苦手単語クイズ
// ==============================

function createWeakQuiz() {

  const weakWords =
    words.filter(item => {

      const data =
        studyData[item.word];


      return (
        data.wrong >= 2 &&
        data.wrong > data.correct
      );

    });


  weakWords.sort((a, b) => {

    const A =
      studyData[a.word];

    const B =
      studyData[b.word];


    return (
      B.wrong - A.wrong
    );

  });


  return weakWords.slice(
    0,
    10
  );

}


// ==============================
// クイズ開始
// ==============================

function startQuiz() {

  if (
    quizMode === "weak"
  ) {

    quizWords =
      createWeakQuiz();

  }

  else {

    quizWords =
      createNormalQuiz();

  }


  if (
    quizWords.length === 0
  ) {

    showNoWeakWords();

    return;

  }


  currentQuestion = 0;

  correctCount = 0;

  showQuestion();

}


// ==============================
// 苦手単語なし
// ==============================

function showNoWeakWords() {

  document.getElementById(
    "word"
  ).textContent =
    "🎉 苦手単語はありません！";


  document.getElementById(
    "choices"
  ).innerHTML = "";


  document.getElementById(
    "result"
  ).textContent =
    "すべての単語をよく覚えています！";


  document.getElementById(
    "progress"
  ).textContent =
    "CLEAR";


  document.getElementById(
    "nextButton"
  ).style.display =
    "none";

}


// ==============================
// 問題表示
// ==============================

function showQuestion() {

  answered = false;


  const question =
    quizWords[currentQuestion];


  const data =
    studyData[question.word];


  document.getElementById(
    "word"
  ).textContent =
    question.word;


  document.getElementById(
    "progress"
  ).textContent =
    `${currentQuestion + 1} / ${quizWords.length}`;


  document.getElementById(
    "correct"
  ).textContent =
    correctCount;


  document.getElementById(
    "total"
  ).textContent =
    currentQuestion;


  document.getElementById(
    "result"
  ).textContent = "";


  document.getElementById(
    "nextButton"
  ).style.display =
    "none";


  // ==============================
  // 選択肢
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
        item =>
          item.meaning
      )
      .sort(
        () => Math.random() - 0.5
      );


  choices.push(
    ...otherMeanings.slice(
      0,
      3
    )
  );


  choices.sort(
    () => Math.random() - 0.5
  );


  const choicesArea =
    document.getElementById(
      "choices"
    );


  choicesArea.innerHTML = "";


  choices.forEach(choice => {

    const button =
      document.createElement(
        "button"
      );


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
// 答え判定
// ==============================

function answer(
  selected,
  correct
) {

  if (answered) return;


  answered = true;


  const result =
    document.getElementById(
      "result"
    );


  const currentWord =
    quizWords[currentQuestion];


  const data =
    studyData[currentWord.word];


  // ==============================
  // 正解
  // ==============================

  if (
    selected === correct
  ) {

    data.correct++;

    data.streak++;

    correctCount++;


    result.textContent =
      `⭕ 正解！ ${getMasteryStars(data.streak)}`;


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


  // 表示

  document.getElementById(
    "correct"
  ).textContent =
    correctCount;


  document.getElementById(
    "total"
  ).textContent =
    currentQuestion + 1;


  // 選択肢を無効化

  const buttons =
    document.querySelectorAll(
      "#choices button"
    );


  buttons.forEach(button => {

    button.disabled = true;

  });


  // 次へ

  document.getElementById(
    "nextButton"
  ).style.display =
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
// 終了
// ==============================

function finishQuiz() {

  const percentage =
    Math.round(
      (
        correctCount /
        quizWords.length
      ) * 100
    );


  document.getElementById(
    "word"
  ).textContent =
    "🎉 終了！";


  document.getElementById(
    "choices"
  ).innerHTML = "";


  document.getElementById(
    "result"
  ).textContent =
    `${quizWords.length}問中 ${correctCount}問正解！`;


  document.getElementById(
    "progress"
  ).textContent =
    `${percentage}%`;


  document.getElementById(
    "total"
  ).textContent =
    quizWords.length;


  document.getElementById(
    "nextButton"
  ).style.display =
    "none";

}


// ==============================
// 開始
// ==============================

startQuiz();

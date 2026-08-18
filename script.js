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


// 保存

function saveStudyData() {

  localStorage.setItem(
    "wordStudyData",
    JSON.stringify(studyData)
  );

}

saveStudyData();


// ==============================
// クイズ設定
// ==============================

let quizWords = [];
let currentQuestion = 0;
let correctCount = 0;
let answered = false;


// ==============================
// URLを確認
// ==============================

const urlParams =
  new URLSearchParams(
    window.location.search
  );

const quizMode =
  urlParams.get("mode");


// ==============================
// 通常クイズを作る
// ==============================

function createNormalQuiz() {

  let pool = [];


  words.forEach(item => {

    const data =
      studyData[item.word];

    // 苦手度
    const weakness =
      Math.max(
        1,
        data.wrong * 3 -
        data.streak +
        1
      );


    // 苦手な単語ほど多く追加
    for (
      let i = 0;
      i < weakness;
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


  // 10問に足りなければ追加

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
// 苦手単語クイズを作る
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


  // 苦手単語がない場合

  if (
    weakWords.length === 0
  ) {

    return [];

  }


  // シャッフル

  weakWords.sort(
    () => Math.random() - 0.5
  );


  // 最大10問

  return weakWords.slice(
    0,
    10
  );

}


// ==============================
// クイズ開始
// ==============================

function startQuiz() {

  // 苦手単語モード

  if (
    quizMode === "weak"
  ) {

    quizWords =
      createWeakQuiz();

  }

  // 通常モード

  else {

    quizWords =
      createNormalQuiz();

  }


  // 苦手単語がない場合

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
// 苦手単語がない場合
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


  // 表示更新

  document.getElementById(
    "correct"
  ).textContent =
    correctCount;


  document.getElementById(
    "total"
  ).textContent =
    currentQuestion + 1;


  // ボタンを無効化

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
// クイズ終了
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

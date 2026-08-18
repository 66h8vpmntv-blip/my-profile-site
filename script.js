// ==============================
// 英単語データ
// ==============================

const words = [

  // ============================
  // 🌱 中学レベル
  // ============================

  {
    word: "apple",
    meaning: "りんご",
    level: "junior"
  },

  {
    word: "book",
    meaning: "本",
    level: "junior"
  },

  {
    word: "school",
    meaning: "学校",
    level: "junior"
  },

  {
    word: "teacher",
    meaning: "先生",
    level: "junior"
  },

  {
    word: "friend",
    meaning: "友達",
    level: "junior"
  },

  {
    word: "house",
    meaning: "家",
    level: "junior"
  },

  {
    word: "water",
    meaning: "水",
    level: "junior"
  },

  {
    word: "food",
    meaning: "食べ物",
    level: "junior"
  },


  // ============================
  // 📖 高校レベル
  // ============================

  {
    word: "beautiful",
    meaning: "美しい",
    level: "high"
  },

  {
    word: "important",
    meaning: "重要な",
    level: "high"
  },

  {
    word: "necessary",
    meaning: "必要な",
    level: "high"
  },

  {
    word: "environment",
    meaning: "環境",
    level: "high"
  },

  {
    word: "experience",
    meaning: "経験",
    level: "high"
  },


  // ============================
  // 🎯 TOEIC 400
  // ============================

  {
    word: "meeting",
    meaning: "会議",
    level: "toeic400"
  },

  {
    word: "office",
    meaning: "会社・事務所",
    level: "toeic400"
  },

  {
    word: "customer",
    meaning: "顧客",
    level: "toeic400"
  },

  {
    word: "schedule",
    meaning: "予定",
    level: "toeic400"
  },

  {
    word: "employee",
    meaning: "従業員",
    level: "toeic400"
  },


  // ============================
  // 🚀 TOEIC 500
  // ============================

  {
    word: "available",
    meaning: "利用できる",
    level: "toeic500"
  },

  {
    word: "purchase",
    meaning: "購入する",
    level: "toeic500"
  },

  {
    word: "provide",
    meaning: "提供する",
    level: "toeic500"
  },

  {
    word: "increase",
    meaning: "増加する",
    level: "toeic500"
  },

  {
    word: "improve",
    meaning: "改善する",
    level: "toeic500"
  },


  // ============================
  // 🔥 TOEIC 600
  // ============================

  {
    word: "require",
    meaning: "必要とする",
    level: "toeic600"
  },

  {
    word: "determine",
    meaning: "決定する",
    level: "toeic600"
  },

  {
    word: "effective",
    meaning: "効果的な",
    level: "toeic600"
  },

  {
    word: "additional",
    meaning: "追加の",
    level: "toeic600"
  },

  {
    word: "responsible",
    meaning: "責任がある",
    level: "toeic600"
  },


  // ============================
  // 💪 TOEIC 700
  // ============================

  {
    word: "contribute",
    meaning: "貢献する",
    level: "toeic700"
  },

  {
    word: "approximately",
    meaning: "およそ",
    level: "toeic700"
  },

  {
    word: "acquire",
    meaning: "習得する・獲得する",
    level: "toeic700"
  },

  {
    word: "considerable",
    meaning: "かなりの",
    level: "toeic700"
  },

  {
    word: "implement",
    meaning: "実施する",
    level: "toeic700"
  }

];

// ==============================
// 英単語データ
// ==============================

let studyData =
  JSON.parse(
    localStorage.getItem("wordStudyData")
  ) || {};


// ==============================
// データの初期化
// ==============================

words.forEach(item => {

  if (!studyData[item.word]) {

    studyData[item.word] = {
      correct: 0,
      wrong: 0,
      streak: 0,
      nextReview: null
    };

  }

  // 古いデータにも対応

  if (
    studyData[item.word].nextReview === undefined
  ) {

    studyData[item.word].nextReview = null;

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
// 復習間隔
// ==============================

function getReviewInterval(streak) {

  if (streak >= 5) {
    return 14 * 24 * 60 * 60 * 1000;
  }

  if (streak === 4) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  if (streak === 3) {
    return 3 * 24 * 60 * 60 * 1000;
  }

  if (streak === 2) {
    return 24 * 60 * 60 * 1000;
  }

  if (streak === 1) {
    return 10 * 60 * 1000;
  }

  return 0;
}


// ==============================
// 次回復習日を設定
// ==============================

function setNextReview(data) {

  const interval =
    getReviewInterval(data.streak);

  data.nextReview =
    new Date(
      Date.now() + interval
    ).toISOString();

}


// ==============================
// 復習期限が来ているか
// ==============================

function isReviewDue(data) {

  if (!data.nextReview) {
    return false;
  }

  return (
    new Date(data.nextReview).getTime()
    <= Date.now()
  );

}


// ==============================
// 復習日時の表示
// ==============================

function getReviewText(data) {

  if (!data.nextReview) {
    return "まだ復習予定なし";
  }

  const reviewDate =
    new Date(data.nextReview);

  if (
    reviewDate.getTime() <= Date.now()
  ) {

    return "🔥 今すぐ復習";

  }

  const diff =
    reviewDate.getTime() -
    Date.now();

  const minutes =
    Math.ceil(
      diff / (60 * 1000)
    );

  if (minutes < 60) {

    return `⏰ ${minutes}分後`;

  }

  const hours =
    Math.ceil(
      minutes / 60
    );

  if (hours < 24) {

    return `⏰ ${hours}時間後`;

  }

  const days =
    Math.ceil(
      hours / 24
    );

  return `📅 ${days}日後`;

}


// ==============================
// 定着度
// ==============================

function getMasteryLevel(streak) {

  return Math.min(
    streak,
    5
  );

}


function getMasteryStars(streak) {

  const level =
    getMasteryLevel(streak);

  return (
    "★".repeat(level) +
    "☆".repeat(5 - level)
  );

}


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
// URL
// ==============================

const urlParams =
  new URLSearchParams(
    window.location.search
  );

const quizMode =
  urlParams.get("mode");


// ==============================
// クイズ
// ==============================

let quizWords = [];

let currentQuestion = 0;

let correctCount = 0;

let answered = false;


// ==============================
// 復習対象を取得
// ==============================

function createReviewQuiz() {

  return words
    .filter(item => {

      const data =
        studyData[item.word];

      return isReviewDue(data);

    })
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

}


// ==============================
// 苦手単語
// ==============================

function createWeakQuiz() {

  return words
    .filter(item => {

      const data =
        studyData[item.word];

      return (
        data.wrong >= 2 &&
        data.wrong > data.correct
      );

    })
    .sort((a, b) => {

      const A =
        studyData[a.word];

      const B =
        studyData[b.word];

      return (
        B.wrong - A.wrong
      );

    })
    .slice(0, 10);

}


// ==============================
// 通常クイズ
// ==============================

function createNormalQuiz() {

  let pool = [];

  words.forEach(item => {

    const data =
      studyData[item.word];

    let priority = 1;


    // 復習期限が来た単語を最優先

    if (
      isReviewDue(data)
    ) {

      priority += 10;

    }


    // 苦手単語

    if (
      data.wrong >= 2 &&
      data.wrong > data.correct
    ) {

      priority += 5;

    }


    // 定着していない単語

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


    // 習得済みは低頻度

    if (
      data.streak >= 5 &&
      !isReviewDue(data)
    ) {

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
        x =>
          x.word === item.word
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


  return selected;

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

  else if (
    quizMode === "review"
  ) {

    quizWords =
      createReviewQuiz();

  }

  else {

    quizWords =
      createNormalQuiz();

  }


  if (
    quizWords.length === 0
  ) {

    showNoReview();

    return;

  }


  currentQuestion = 0;

  correctCount = 0;

  showQuestion();

}


// ==============================
// 復習対象なし
// ==============================

function showNoReview() {

  const word =
    document.getElementById(
      "word"
    );

  const choices =
    document.getElementById(
      "choices"
    );

  const result =
    document.getElementById(
      "result"
    );

  const progress =
    document.getElementById(
      "progress"
    );

  const next =
    document.getElementById(
      "nextButton"
    );


  if (word) {

    word.textContent =
      "🎉 復習完了！";

  }

  if (choices) {

    choices.innerHTML = "";

  }

  if (result) {

    result.textContent =
      "今すぐ復習する単語はありません！";

  }

  if (progress) {

    progress.textContent =
      "CLEAR";

  }

  if (next) {

    next.style.display =
      "none";

  }

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


  // 選択肢

  let choices = [
    question.meaning
  ];


  const others =
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
    ...others.slice(0, 3)
  );


  choices.sort(
    () => Math.random() - 0.5
  );


  const area =
    document.getElementById(
      "choices"
    );


  area.innerHTML = "";


  choices.forEach(choice => {

    const button =
      document.createElement(
        "button"
      );


    button.textContent =
      choice;


    button.onclick =
      () => {

        answer(
          choice,
          question.meaning
        );

      };


    area.appendChild(
      button
    );

  });

}


// ==============================
// 回答
// ==============================

function answer(
  selected,
  correct
) {

  if (answered) return;

  answered = true;


  const currentWord =
    quizWords[currentQuestion];


  const data =
    studyData[currentWord.word];


  const result =
    document.getElementById(
      "result"
    );


  // ==============================
  // 正解
  // ==============================

  if (
    selected === correct
  ) {

    data.correct++;

    data.streak++;

    correctCount++;


    // 正解したら次回復習を設定

    setNextReview(data);


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


    // 間違えたらすぐ復習対象

    data.nextReview =
      new Date().toISOString();


    result.textContent =
      `❌ 不正解…… 正解は「${correct}」`;


    result.className =
      "incorrect";

  }


  saveStudyData();


  document.getElementById(
    "correct"
  ).textContent =
    correctCount;


  document.getElementById(
    "total"
  ).textContent =
    currentQuestion + 1;


  // ボタン無効化

  document
    .querySelectorAll(
      "#choices button"
    )
    .forEach(button => {

      button.disabled = true;

    });


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

/* =========================================
   SACCHERI EXPLORER
   INTERACTIVE VERSION
========================================= */


/* =========================================
   PAGE NAVIGATION
========================================= */

const navButtons =
  document.querySelectorAll(".nav-button");

const pages =
  document.querySelectorAll(".page");


function openPage(pageName) {

  pages.forEach(page => {
    page.classList.remove("active");
  });

  navButtons.forEach(button => {
    button.classList.remove("active");
  });

  const page =
    document.getElementById(pageName);

  const button =
    document.querySelector(
      `[data-page="${pageName}"]`
    );

  if (page) {
    page.classList.add("active");
  }

  if (button) {
    button.classList.add("active");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


navButtons.forEach(button => {

  button.addEventListener("click", () => {

    openPage(button.dataset.page);

  });

});


document
  .getElementById("startButton")
  .addEventListener("click", () => {

    openPage("explore");

  });


/* =========================================
   CANVAS
========================================= */

const canvas =
  document.getElementById(
    "saccheriCanvas"
  );

const ctx =
  canvas.getContext("2d");


/* =========================================
   STATE
========================================= */

let geometry =
  "euclidean";

let baseLength = 440;

let legLength = 190;

let curvature = 0;

let showMeasurements = true;


/* =========================================
   DOM ELEMENTS
========================================= */

const angleValue =
  document.getElementById(
    "angleValue"
  );

const geometryName =
  document.getElementById(
    "geometryName"
  );

const formula =
  document.getElementById(
    "formula"
  );

const explanationTitle =
  document.getElementById(
    "explanationTitle"
  );

const explanationText =
  document.getElementById(
    "explanationText"
  );

const observationText =
  document.getElementById(
    "observationText"
  );


/* =========================================
   SLIDERS
========================================= */

const baseSlider =
  document.getElementById(
    "baseSlider"
  );

const heightSlider =
  document.getElementById(
    "heightSlider"
  );

const curvatureSlider =
  document.getElementById(
    "curvatureSlider"
  );


baseSlider.addEventListener(
  "input",
  () => {

    baseLength =
      Number(baseSlider.value);

    document.getElementById(
      "baseValue"
    ).textContent =
      baseLength;

    draw();

  }
);


heightSlider.addEventListener(
  "input",
  () => {

    legLength =
      Number(heightSlider.value);

    document.getElementById(
      "heightValue"
    ).textContent =
      legLength;

    draw();

  }
);


curvatureSlider.addEventListener(
  "input",
  () => {

    curvature =
      Number(curvatureSlider.value);

    document.getElementById(
      "curvatureValue"
    ).textContent =
      curvature;

    draw();

  }
);


/* =========================================
   MEASUREMENT TOGGLE
========================================= */

document
  .getElementById("measurementToggle")
  .addEventListener(
    "change",
    event => {

      showMeasurements =
        event.target.checked;

      draw();

    }
  );


/* =========================================
   GEOMETRY BUTTONS
========================================= */

const geometryButtons =
  document.querySelectorAll(
    ".geometry-button"
  );


geometryButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      geometryButtons.forEach(
        other => {
          other.classList.remove(
            "selected"
          );
        }
      );

      button.classList.add(
        "selected"
      );

      geometry =
        button.dataset.geometry;

      updateExplanation();

      draw();

    }
  );

});


/* =========================================
   SUMMIT ANGLE
========================================= */

function getSummitAngle() {

  if (geometry === "euclidean") {

    return 90;

  }


  if (geometry === "elliptic") {

    /*
      Positive curvature:
      angle becomes greater than 90°
    */

    const effect =
      Math.abs(curvature) * 0.10;

    return Math.min(
      130,
      95 + effect
    );

  }


  if (geometry === "hyperbolic") {

    /*
      Negative curvature:
      angle becomes less than 90°
    */

    const effect =
      Math.abs(curvature) * 0.12;

    return Math.max(
      50,
      85 - effect
    );

  }


  return 90;

}


/* =========================================
   EXPLANATION
========================================= */

function updateExplanation() {

  const angle =
    getSummitAngle();


  geometryName.textContent =
    geometry.charAt(0).toUpperCase()
    + geometry.slice(1);


  angleValue.textContent =
    angle.toFixed(1) + "°";


  if (geometry === "euclidean") {

    explanationTitle.textContent =
      "Euclidean Geometry";

    explanationText.textContent =
      "The space is flat. The summit angles remain 90°, so the Saccheri quadrilateral is a rectangle.";

    formula.textContent =
      "α = 90°";

    observationText.textContent =
      "No matter how you change the size, the summit angles remain 90°.";

  }


  if (geometry === "elliptic") {

    explanationTitle.textContent =
      "Elliptic Geometry";

    explanationText.textContent =
      "Positive curvature produces the obtuse-angle hypothesis. The summit angles are greater than 90°.";

    formula.textContent =
      "α > 90°";

    observationText.textContent =
      "As the positive curvature increases, the summit angle becomes more obtuse.";

  }


  if (geometry === "hyperbolic") {

    explanationTitle.textContent =
      "Hyperbolic Geometry";

    explanationText.textContent =
      "Negative curvature produces the acute-angle hypothesis. The summit angles are less than 90°.";

    formula.textContent =
      "α < 90°";

    observationText.textContent =
      "As the negative curvature increases, the summit angle becomes more acute.";

  }

}


/* =========================================
   DRAW SACCHERI
========================================= */

function draw() {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  /* Background */

  ctx.fillStyle =
    "#f8faff";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  /* =====================================
     CALCULATE POINTS
  ===================================== */

  const centerX = 450;

  const bottomY = 390;

  const topY =
    bottomY - legLength;


  const halfBase =
    baseLength / 2;


  const A = {

    x: centerX - halfBase,

    y: bottomY

  };


  const B = {

    x: centerX + halfBase,

    y: bottomY

  };


  /*
    The curvature controls how strongly
    the upper part bends inward/outward.
  */

  let curveAmount =
    curvature * 0.8;


  let D = {

    x:
      centerX -
      halfBase +
      curveAmount * 0.35,

    y:
      topY

  };


  let C = {

    x:
      centerX +
      halfBase -
      curveAmount * 0.35,

    y:
      topY

  };


  /* =====================================
     DRAW SHAPE
  ===================================== */

  ctx.beginPath();

  ctx.moveTo(
    A.x,
    A.y
  );


  /* LEFT LEG */

  if (geometry === "euclidean") {

    ctx.lineTo(
      D.x,
      D.y
    );

  }

  else {

    ctx.quadraticCurveTo(

      A.x - curveAmount * 0.7,

      (A.y + D.y) / 2,

      D.x,
      D.y

    );

  }


  /* SUMMIT */

  if (geometry === "euclidean") {

    ctx.lineTo(
      C.x,
      C.y
    );

  }

  else {

    ctx.quadraticCurveTo(

      centerX,

      topY - curveAmount * 0.7,

      C.x,
      C.y

    );

  }


  /* RIGHT LEG */

  if (geometry === "euclidean") {

    ctx.lineTo(
      B.x,
      B.y
    );

  }

  else {

    ctx.quadraticCurveTo(

      B.x + curveAmount * 0.7,

      (B.y + C.y) / 2,

      B.x,
      B.y

    );

  }


  ctx.closePath();


  /* FILL */

  ctx.fillStyle =
    "#e9ebff";

  ctx.fill();


  /* OUTLINE */

  ctx.strokeStyle =
    "#5757c8";

  ctx.lineWidth = 6;

  ctx.stroke();


  /* =====================================
     BASE
  ===================================== */

  ctx.beginPath();

  ctx.moveTo(
    A.x,
    A.y
  );

  ctx.lineTo(
    B.x,
    B.y
  );

  ctx.strokeStyle =
    "#303858";

  ctx.lineWidth = 6;

  ctx.stroke();


  /* =====================================
     POINTS
  ===================================== */

  drawPoint(
    A,
    "A"
  );

  drawPoint(
    B,
    "B"
  );

  drawPoint(
    C,
    "C"
  );

  drawPoint(
    D,
    "D"
  );


  /* =====================================
     RIGHT ANGLE MARKS
  ===================================== */

  drawRightAngle(A);

  drawRightAngle(B);


  /* =====================================
     EQUAL LEG MARKS
  ===================================== */

  drawEqualMark(
    A,
    D
  );

  drawEqualMark(
    B,
    C
  );


  /* =====================================
     MEASUREMENTS
  ===================================== */

  if (showMeasurements) {

    drawMeasurements(
      A,
      B,
      C,
      D
    );

  }


  /* =====================================
     TITLE
  ===================================== */

  ctx.textAlign =
    "center";

  ctx.font =
    "bold 24px Arial";

  ctx.fillStyle =
    "#5050b9";

  ctx.fillText(
    "Saccheri Quadrilateral",
    centerX,
    45
  );

  ctx.textAlign =
    "left";


  /* Update angle */

  updateExplanation();

}


/* =========================================
   DRAW POINT
========================================= */

function drawPoint(
  point,
  label
) {

  ctx.beginPath();

  ctx.arc(
    point.x,
    point.y,
    7,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    "#5757c8";

  ctx.fill();


  ctx.font =
    "bold 19px Arial";

  ctx.fillStyle =
    "#29324d";

  ctx.fillText(
    label,
    point.x + 11,
    point.y - 10
  );

}


/* =========================================
   RIGHT ANGLE
========================================= */

function drawRightAngle(
  point
) {

  ctx.beginPath();

  ctx.moveTo(
    point.x + 25,
    point.y
  );

  ctx.lineTo(
    point.x + 25,
    point.y - 25
  );

  ctx.lineTo(
    point.x,
    point.y - 25
  );

  ctx.strokeStyle =
    "#e28b45";

  ctx.lineWidth = 3;

  ctx.stroke();

}


/* =========================================
   EQUAL LEG MARK
========================================= */

function drawEqualMark(
  P1,
  P2
) {

  const x =
    (P1.x + P2.x) / 2;

  const y =
    (P1.y + P2.y) / 2;


  ctx.beginPath();

  ctx.arc(
    x,
    y,
    5,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    "#5050b9";

  ctx.fill();

}


/* =========================================
   MEASUREMENTS
========================================= */

function drawMeasurements(
  A,
  B,
  C,
  D
) {

  const angle =
    getSummitAngle();


  ctx.font =
    "bold 23px Arial";

  ctx.fillStyle =
    "#5050b9";


  ctx.fillText(
    "α = " +
    angle.toFixed(1) +
    "°",
    D.x + 15,
    D.y + 38
  );


  ctx.fillText(
    "α = " +
    angle.toFixed(1) +
    "°",
    C.x - 105,
    C.y + 38
  );


  ctx.font =
    "16px Arial";

  ctx.fillStyle =
    "#707a91";


  ctx.fillText(
    "90°",
    A.x + 32,
    A.y - 30
  );


  ctx.fillText(
    "90°",
    B.x - 65,
    B.y - 30
  );

}


/* =========================================
   CHALLENGE
========================================= */

const answerButtons =
  document.querySelectorAll(
    ".answer-button"
  );


const feedback =
  document.getElementById(
    "feedback"
  );


answerButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      const answer =
        button.dataset.answer;


      if (answer === "less") {

        feedback.className =
          "feedback correct";


        feedback.innerHTML = `

          <strong>🎉 Correct!</strong>

          <br><br>

          In hyperbolic geometry,
          the angle sum of a quadrilateral
          is less than 360°.

          <br><br>

          90° + 90° + α + α &lt; 360°

          <br><br>

          Therefore:

          <br>

          <strong>α &lt; 90°</strong>

        `;

      }

      else {

        feedback.className =
          "feedback incorrect";


        feedback.innerHTML = `

          <strong>Not quite!</strong>

          <br><br>

          Remember the hyperbolic case:

          <br><br>

          <strong>α &lt; 90°</strong>

        `;

      }

    }

  );

});


/* =========================================
   PARALLEL LAB
========================================= */

const parallelCanvas =
  document.getElementById(
    "parallelCanvas"
  );

const pctx =
  parallelCanvas.getContext(
    "2d"
  );


const parallelButtons =
  document.querySelectorAll(
    ".parallel-button"
  );


parallelButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      parallelButtons.forEach(
        other => {

          other.classList.remove(
            "selected"
          );

        }
      );


      button.classList.add(
        "selected"
      );


      drawParallel(
        button.dataset.parallel
      );

    }

  );

});


function drawParallel(
  type
) {

  pctx.clearRect(
    0,
    0,
    parallelCanvas.width,
    parallelCanvas.height
  );


  pctx.fillStyle =
    "#f8faff";

  pctx.fillRect(
    0,
    0,
    parallelCanvas.width,
    parallelCanvas.height
  );


  /* Given geodesic */

  pctx.beginPath();

  pctx.moveTo(
    100,
    300
  );

  pctx.lineTo(
    800,
    300
  );

  pctx.strokeStyle =
    "#303858";

  pctx.lineWidth = 6;

  pctx.stroke();


  /* Point */

  const px = 450;

  const py = 100;


  pctx.beginPath();

  pctx.arc(
    px,
    py,
    9,
    0,
    Math.PI * 2
  );

  pctx.fillStyle =
    "#5757c8";

  pctx.fill();


  pctx.font =
    "bold 20px Arial";

  pctx.fillStyle =
    "#29324d";

  pctx.fillText(
    "P",
    px + 13,
    py
  );


  if (type === "euclidean") {

    drawStraightLine(
      100,
      100,
      800,
      100
    );


    updateParallelText(
      "1",
      "Exactly one parallel geodesic",
      "Euclidean geometry has exactly one parallel through a point outside a line."
    );

  }


  if (type === "elliptic") {

    drawCurve(
      100,
      90,
      450,
      300,
      800,
      90
    );


    drawCurve(
      200,
      70,
      450,
      300,
      700,
      70
    );


    updateParallelText(
      "0",
      "No parallel geodesics",
      "In the spherical/elliptic model, geodesics eventually meet."
    );

  }


  if (type === "hyperbolic") {

    drawHyperbolic(
      -1
    );

    drawHyperbolic(
      0
    );

    drawHyperbolic(
      1
    );


    updateParallelText(
      ">1",
      "More than one parallel geodesic",
      "Hyperbolic geometry allows multiple geodesics through a point that do not meet the given geodesic."
    );

  }

}


function drawStraightLine(
  x1,
  y1,
  x2,
  y2
) {

  pctx.beginPath();

  pctx.moveTo(
    x1,
    y1
  );

  pctx.lineTo(
    x2,
    y2
  );

  pctx.strokeStyle =
    "#5757c8";

  pctx.lineWidth = 5;

  pctx.stroke();

}


function drawCurve(
  x1,
  y1,
  cx,
  cy,
  x2,
  y2
) {

  pctx.beginPath();

  pctx.moveTo(
    x1,
    y1
  );

  pctx.quadraticCurveTo(
    cx,
    cy,
    x2,
    y2
  );

  pctx.strokeStyle =
    "#5757c8";

  pctx.lineWidth = 4;

  pctx.stroke();

}


function drawHyperbolic(
  offset
) {

  pctx.beginPath();

  pctx.moveTo(
    130,
    130 + offset * 80
  );

  pctx.quadraticCurveTo(
    450,
    70,
    770,
    130 - offset * 80
  );

  pctx.strokeStyle =
    "#5757c8";

  pctx.lineWidth = 4;

  pctx.stroke();

}


function updateParallelText(
  number,
  title,
  description
) {

  document.getElementById(
    "parallelNumber"
  ).textContent =
    number;

  document.getElementById(
    "parallelTitle"
  ).textContent =
    title;

  document.getElementById(
    "parallelDescription"
  ).textContent =
    description;

}


/* =========================================
   INITIALISE
========================================= */

updateExplanation();

draw();

drawParallel(
  "euclidean"
);

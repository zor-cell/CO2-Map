let gx = 15;
let gy = 100;
let gw = 25;
let gh = 300;
let bx = 15;
let by = gy + gh + 20;
let bw = gw;
let bh = gw;

let show = false;
let show1 = false;
let show2 = false;
let show3 = false;
let check1 = true;
let check2 = true;
let check3 = true;

let showR1bool = false;
let showR2bool = false;
let showR3bool = false;
let showR1 = 1;
let showR2 = 1;
let showR3 = 1;
let colR1 = 100;
let colR2 = 100;
let colR3 = 100;
let alphaR1 = 0;
let alphaR2 = 0;
let alphaR3 = 0;

let check = true;
let test = true;

let alphaGrad = 255;
let alphaBut;
let alphaShow;
let col1;

let myMap;
let canvas;
let toggle = true;

let countries;

const mappa = new Mappa('Leaflet');

const options = {
  lat: 20,
  lng: 30,
  zoom: 2,
  style: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
}


function preload() {
  dataAll = loadTable("dataAll.csv", "csv", "header");
  savingDataAll = loadTable("dataAll.csv", "csv", "header");
  dataOne = loadTable("dataOne.csv", "csv", "header");
  savingDataOne = loadTable("dataOne.csv", "csv", "header");

  countries = loadJSON("countries.json");
  arrow = loadImage("arrow.png");
}

function setup() {
  canvas = createCanvas(900, 500);
  canvas.parent("container");

  dataButton = createButton("Ansicht wechseln");
  dataButton.parent("sketch");
  dataButton.style("font-size", "16px");
  dataButton.style("background-color", "#DAAD86");
  dataButton.style("color", "white");
  dataButton.size(200);
  dataButton.mousePressed(toggleData);

  par1 = createP("Angaben in Millionen Tonnen");
  par1.parent("sketch");
  par1.style("font-size", "20px");
  par1.style("color", "#DAAD86");
  par1.style("display", "inline");
  par1.style("padding-left", "20px");
  par1.style("font-weight", "bold");

  par2 = createP("Daten aus 2016; Quelle: https://www.laenderdaten.info/co2-nach-laendern.php");
  par2.style("font-size", "10px");
  par2.style("padding-top", "0px");

  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
}

function draw() {
  clear();
  cursor(ARROW);

  var color1 = color(255, 0, 0);
  var color2 = color(255, 255, 0);
  var color3 = color(0, 255, 0);

  if (toggle) {
    ranking(dataAll.rows, savingDataAll.rows);
    stroke(0);
    fill(0);
    textSize(18);
    text("Gesamt-Emissionen",width / 2, 10);
  } else {
    ranking(dataOne.rows, savingDataOne.rows);
    
      stroke(0);
    fill(0);
    textSize(18);
    text("Pro-Kopf-Emissionen",width / 2, 10);
  }

  visual();
  setGradient(color1, color2, color3);
}

function ranking(array, saveArray) {
  if (show1 && check1) {
    //reset
    array.splice(0);
    for (let row of saveArray) {
      array.push(row);
    }

    //get amount
    array.splice(25, 75); //take away last 75 elements
    check1 = false;
  }

  if (show2 && check2) {
    //reset
    array.splice(0);
    for (let row of saveArray) {
      array.push(row);
    }

    //get amount
    array.splice(50, 50); //take away last 50 elements
    array.splice(0, 25); //take away first 25 elements
    check2 = false;
  }

  if (show3 && check3) {
    //reset
    array.splice(0);
    for (let row of saveArray) {
      array.push(row);
    }

    //get amount
    array.splice(0, 50); //take away first 50 elements
    check3 = false;
  }

  if (show && array.length <= 100) {
    //reset
    array.splice(0);
    for (let row of saveArray) {
      array.push(row);
    }
  }
}

function visual() {
  //Gesamt
  for (let row of dataAll.rows) {
    let place = row.get("Stelle_Gesamt");
    let count = row.get("CO2_Gesamt");
    let countryName = row.get("Land");
    let countryId = row.get("id");
    let diameter = sqrt(count) / 3000 * pow(2, myMap.zoom());
    let latlng = countries[countryId];

    if (latlng) {
      let lat = latlng[0];
      let lng = latlng[1];
      const pix = myMap.latLngToPixel(lat, lng)

      if (toggle) {
        let redAll = map(place, 40, 100, 255, 25);
        let greenAll = map(place, 0, 40, 0, 255);

        hover(pix, diameter, countryId.toUpperCase(), nfc(count, 0), place, countryName);
        stroke(0);
        fill(redAll, greenAll, 0, alphaShow);
        ellipse(pix.x, pix.y, diameter);

        stroke(0);
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(diameter / 5);
        text(count / 1000000, pix.x, pix.y); //Angabe in Millionen Tonnen

        stroke(0);
        fill(0);
        textSize(diameter / 7);
        text(countryId.toUpperCase(), pix.x, pix.y + diameter / 6);
      }
    }
  }

  //Einzel
  for (let row of dataOne.rows) {
    let place = row.get("Stelle_Kopf");
    let count = row.get("CO2_pro_Kopf");
    let countryName = row.get("Land");
    let countryId = row.get("id");
    let diameter = sqrt(count) * 2 * pow(2, myMap.zoom());
    let latlng = countries[countryId];

    if (latlng) {
      let lat = latlng[0];
      let lng = latlng[1];
      const pix = myMap.latLngToPixel(lat, lng)

      if (toggle == false) {
        let redOne = map(place, 40, 100, 255, 25);
        let greenOne = map(place, 0, 40, 0, 255);

        hover(pix, diameter, countryId.toUpperCase(), nfc(count, 2), place, countryName);

        stroke(0);
        fill(redOne, greenOne, 0, alphaShow);
        ellipse(pix.x, pix.y, diameter);

        stroke(0);
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(diameter / 5);
        text(count, pix.x, pix.y); //Angabe in Tonnen

        stroke(0);
        fill(0);
        textSize(diameter / 7);
        text(countryId.toUpperCase(), pix.x, pix.y + diameter / 6);
      }
    }
  }
}

function hover(px, dia, id, count, plc, name) {
  if (mouseX >= px.x - dia / 2 && mouseX <= px.x + dia / 2 && mouseY >= px.y - dia / 2 && mouseY <= px.y + dia / 2) {
    stroke(0);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(18);
    text(plc + ". " + name + " (" + id + ")" + ": " + count + " t", width / 2, height - 10);

    push();
    let y = map(plc, 0, 100, gy, gy + gh);
    translate(gx + gw + 5, y);
    rotate(radians(180));
    imageMode(CENTER);
    image(arrow, 0, 0, 10, 10);
    pop();

    alphaShow = 100;
  } else {
    alphaShow = 175;
  }
}

function setGradient(c1, c2, c3) {
  push();
  noFill();
  stroke(0);
  strokeWeight(2);
  rect(gx, gy, gw, gh);
  pop();

  for (let y = gy; y < gy + (gh / 2); y++) {
    let inter = map(y, gy, gy + (gh / 2), 0, 1);
    let col = lerpColor(c1, c2, inter);

    stroke(col);
    line(gx, y, gx + gw, y);
  }

  for (let y = gy + (gh / 2); y < gy + gh; y++) {
    let inter = map(y, gy + (gh / 2), gy + gh, 0, 1);
    let col = lerpColor(c2, c3, inter);

    stroke(col);
    line(gx, y, gx + gw, y);
  }

  push();
  stroke(0);
  fill(255, alphaBut);
  rect(bx, by, bw, bh);

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(bh / 2);
  text("Alle", bx + bw / 2, by + bh / 2);

  push();
  let txt1 = "25";
  let txt2 = "50";
  let txt3 = "100";
  let output1 = "";
  let output2 = "";
  let output3 = "";

  for (let i = 0; i < txt1.length; i += 1) {
    output1 += txt1.charAt(i) + "\n";
  }
  for (let i = 0; i < txt2.length; i += 1) {
    output2 += txt2.charAt(i) + "\n";
  }
  for (let i = 0; i < txt3.length; i += 1) {
    output3 += txt3.charAt(i) + "\n";
  }
  textAlign(CENTER, CENTER);
  textSize(gh / 20);

  text(output1, gx + gw / 2, gy + gh / 6);
  text(output2, gx + gw / 2, gy + gh / 2.5);
  text(output3, gx + gw / 2, gy + gh / 1.25);
  pop();
  
  //rect 1
  fill(255,alphaR1);
  stroke(colR1);
  strokeWeight(showR1);
  rect(gx, gy, gw, gh / 4);
  //rect 2
  fill(255,alphaR2);
  stroke(colR2);
  strokeWeight(showR2);
  rect(gx, gy + gh / 4, gw, gh / 4);
  //rect 3
  fill(255,alphaR3);
  stroke(colR3);
  strokeWeight(showR3);
  rect(gx, gy + gh / 2, gw, gh / 2);
  pop();

  if (showR1bool) {
    showR1 = 3;
    stroke(0);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(18);
    text("TOP 25", width / 2, 30);
  } else {
    showR1 = 1;
  }
  if (showR2bool) {
    showR2 = 3;
    stroke(0);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(18);
    text("TOP 25-50", width / 2, 30);
  } else {
    showR2 = 1;
  }
  if (showR3bool) {
    showR3 = 3;
    stroke(0);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(18);
    text("TOP 50-100", width / 2, 30);
  } else {
    showR3 = 1;
  }

  if (mouseX > bx && mouseX < bx + bw && mouseY > by && mouseY < by + bh) {
    alphaBut = 100;
    cursor(HAND);
  } else {
    alphaBut = 175;
  }

  if (mouseX > gx && mouseX < gx + gw && mouseY > gy && mouseY < gy + gh / 4) {
    alphaR1 = 100;
    colR1 = 50;
    showR1 = 3;
    cursor(HAND);
  } else {
    alphaR1 = 0;
    colR1 = 0;
  }

  if (mouseX > gx && mouseX < gx + gw && mouseY > gy + gh / 4 && mouseY < gy + gh / 2) {
    alphaR2 = 100;
    colR2 = 50;
    showR2 = 3;
    cursor(HAND);
  } else {
    alphaR2 = 0;
    colR2 = 0;
  }

  if (mouseX > gx && mouseX < gx + gw && mouseY > gy + gh / 2 && mouseY < gy + gh) {
    alphaR3 = 100;
    colR3 = 50;
    showR3 = 3;
    cursor(HAND);
  } else {
    alphaR3 = 0;
    colR3 = 0;
  }
}

function mouseClicked() {
  //Button
  if (mouseX > bx && mouseX < bx + bw && mouseY > by && mouseY < by + bh) {
    show = true;
    show1 = false;
    show2 = false;
    show3 = false;

    showR1bool = false;
    showR2bool = false;
    showR3bool = false;
    showR1 = 1;
    showR2 = 1;
    showR3 = 1;

    check1 = true;
    check2 = true;
    check3 = true;
  }

  //show1
  if (check1 && mouseX > gx && mouseX < gx + gw && mouseY > gy && mouseY < gy + gh / 4) {
    show1 = true;
    show = false;
    show2 = false;
    show3 = false;

    showR2bool = false;
    showR3bool = false;
    check2 = true;
    check3 = true;

    showR1bool = true;
  }

  //show2
  if (check2 && mouseX > gx && mouseX < gx + gw && mouseY > gy + gh / 4 && mouseY < gy + gh / 2) {
    show2 = true;
    show = false;
    show1 = false;
    show3 = false;

    showR1bool = false;
    showR3bool = false;
    check1 = true;
    check3 = true;

    showR2bool = true;
  }

  //show3
  if (check3 && mouseX > gx && mouseX < gx + gw && mouseY > gy + gh / 2 && mouseY < gy + gh) {
    show3 = true;
    show = false;
    show1 = false;
    show2 = false;

    showR1bool = false;
    showR2bool = false;
    check1 = true;
    check2 = true;

    showR3bool = true;
  }
}

function toggleData() {
  toggle = !toggle;

  if (toggle) {
    dataButton.html("Gesamt-Emissionen");
    par1.html("Angaben in Millionen Tonnen");
  } else {
    dataButton.html("Pro-Kopf-Emmisionen");
    par1.html("Angaben in Tonnen");
  }
}
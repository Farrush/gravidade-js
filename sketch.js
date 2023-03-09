let sun
let G = 1
let planets = ['', '', '', '', '', '']
let colors = ['#962420', '#897250', '#7e3b96', '#1854df', '#69d025']

function setup() {
  createCanvas(windowWidth * 0.8, windowHeight);
  sun = new Body(800, createVector(0, 0), createVector(0, 0), "#FFE")

  addPlanets()
}
function addPlanets() {
  planets = []
  for (let i = 0; i < 6; i++) {
    let mass = random(10, 40)
    let color = random(colors)
    //posição do planeta
    let r = random(sun.r, min(windowWidth / 2, windowHeight / 2))
    let theta = random(TWO_PI)
    let planetPos = createVector(r * cos(theta), r * sin(theta))

    //velocidade do planeta
    let planetVel = planetPos.copy()
    planetVel.rotate(HALF_PI)
    planetVel.setMag(sqrt((G * sun.mass) / planetPos.mag()))
    planetVel.mult(random(0.85, 1.15))

    if (random(1) < 0.3) {
      planetVel.mult(-1)
    }

    planets.push(new Body(mass, planetPos, planetVel, color))
  }
}
function draw() {
  background(10);
  translate(width / 2, height / 2)
  sun.show()
  sun.resize()
  sun.update()
  for (let i = 0; i < planets.length; i++) {
    if (planets.length > 0) {

      planets[i].show()
      planets[i].update()
      sun.attract(planets[i])

      if (planets[i].collide(sun)) {
        planets.splice(i, 1)
      }
    }

  }
}
function getLog(x, y) {
  return Math.log(y) / Math.log(x)
}
function Body(_mass, _pos, _vel, color) {

  this.mass = _mass
  this.pos = _pos
  this.vel = _vel
  this.path = []
  if(this.mass <= 40){
    this.r = this.mass
    this.color = color
  }
  else if (this.mass <= 400) {
    this.color = color
    this.r = this.mass / 12
  } else if (this.mass > 400 && this.mass <= 4000) {
    this.r = this.mass / 20
    this.color = color
  }
  else {
    this.r = getLog(1.092, this.mass)
    this.color = "#000"
  }
  this.show = function (color) {
    if (this.mass <= 2500) {
      noStroke()
    }
    fill(this.color)
    ellipse(this.pos.x, this.pos.y, this.r, this.r)
    stroke(200)
    if (this.mass < 200) {
      for (let i = 0; i < this.path.length - 2; i++) {
        line(this.path[i].x, this.path[i].y, this.path[i + 1].x, this.path[i + 1].y)
      }
    }

  }

  this.update = function () {
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.path.push(this.pos.copy())
    if (this.path.length > 120) {
      this.path.splice(0, 1)
    }


  }
  this.applyForce = function (f) {
    // cálculo da aceleração F=ma -> a=F/m
    this.vel.x += f.x / this.mass
    this.vel.y += f.y / this.mass

  }
  this.collide = function (collider) {
    //colisão entre o objeto que chama esse método e o objeto passado como parâmetro
    // Se a distancia entre este X,Y e o X,Y do colisor for menor ou igual ao
    //raio do colisor + raio deste objeto retorna true
    if (dist(this.pos.x, this.pos.y, collider.pos.x, collider.pos.y) <= collider.r / 2 + this.r / 2) {
      return true
    }
    return false
  }
  this.attract = function (body) {
    // r = distância entre o corpo e o sol
    let r = dist(this.pos.x, this.pos.y, body.pos.x, body.pos.y)
    // f = direção
    let f = this.pos.copy().sub(body.pos)
    // magnitude da força
    f.setMag((G * this.mass * body.mass) / (r * r))
    body.applyForce(f)
  }

  this.resize = function () {
    let rangeInput = document.querySelector("#star-mass")
    let massDisplayed = document.querySelector("#massa")

    //Define a massa como o valor do input de range
    this.mass = rangeInput.value

    //Define o valor da massa mostrado no menu lateral
    massDisplayed.innerText = this.mass
    if (this.mass <= 400) {
      this.color = color
      this.r = this.mass /12
    } else if (this.mass > 400 && this.mass <= 4000) {
      this.r =  this.mass / 20
      this.color = color
    }
    else {
      this.r = getLog(1.09, this.mass)
      this.color = "#000"
    }
  }
}